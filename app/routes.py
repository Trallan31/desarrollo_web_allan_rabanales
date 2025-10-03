from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os
from . import db
from .models import Region, Comuna, AvisoAdopcion, Foto, ContactarPor
from .validators import validate_aviso, _canon_media

bp = Blueprint("web", __name__)

# === Portada ===
@bp.route("/")
def index():
    ultimos = (AvisoAdopcion.query
               .order_by(AvisoAdopcion.fecha_ingreso.desc())
               .limit(5).all())
    return render_template("index.html", ultimos=ultimos)

# === Listado paginado ===
@bp.route("/avisos")
def listado():
    page = max(int(request.args.get("page", 1)), 1)
    per_page = 5
    pag = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_ingreso.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return render_template("listado.html", pag=pag)

# === Detalle ===
@bp.route("/avisos/<int:aviso_id>")
def detalle(aviso_id):
    aviso = AvisoAdopcion.query.get_or_404(aviso_id)
    return render_template("detalle.html", aviso=aviso)

# === Estadística ===
@bp.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

# === GET Agregar: ===
@bp.route("/avisos/agregar", methods=["GET"])
def agregar_get():
    regiones = Region.query.order_by(Region.nombre.asc()).all()
    min_fecha = (datetime.now() + timedelta(hours=3)).replace(second=0, microsecond=0)
    return render_template("agregar.html", regiones=regiones, min_fecha=min_fecha)

# === API comunas por región ===
@bp.route("/api/comunas")
def api_comunas():
    region_id = request.args.get("region_id", type=int)
    comunas = (Comuna.query
               .filter_by(region_id=region_id)
               .order_by(Comuna.nombre.asc()).all())
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])

# === POST Agregar ===
@bp.route("/avisos/agregar", methods=["POST"])
def agregar_post():
    ok, errores = validate_aviso(request.form, request.files)
    if not ok:
        for e in errores:
            flash(e, "error")
        regiones = Region.query.order_by(Region.nombre.asc()).all()
        selected_region = request.form.get("region_id")
        selected_comuna = request.form.get("comuna_id")
        min_fecha = (datetime.now() + timedelta(hours=3)).replace(second=0, microsecond=0)

        return render_template(
            "agregar.html",
            regiones=regiones,
            selected_region=selected_region,
            selected_comuna=selected_comuna,
            min_fecha=min_fecha,
        ), 400

    # Inserta aviso
    comuna_id = int(request.form["comuna_id"])
    aviso = AvisoAdopcion(
        fecha_ingreso=datetime.now(),
        comuna_id=comuna_id,
        sector=(request.form.get("sector") or None),
        nombre=request.form["nombre"].strip(),
        email=request.form["email"].strip(),
        celular=(request.form.get("celular") or None),
        tipo=request.form["tipo"],
        cantidad=int(request.form["cantidad"]),
        edad=int(request.form["edad"]),
        unidad_medida=request.form["unidad_medida"],
        fecha_entrega=datetime.strptime(request.form["fecha_entrega"], "%Y-%m-%dT%H:%M"),
        descripcion=(request.form.get("descripcion") or None),
    )
    db.session.add(aviso)
    db.session.flush()  # obtener aviso.id

    # Contactar por
    for nombre, ident in zip(request.form.getlist("cp_nombre"), request.form.getlist("cp_identificador")):
        medio = _canon_media(nombre)
        ident = (ident or "").strip()
        if medio and ident:
            db.session.add(ContactarPor(nombre=medio, identificador=ident, aviso_id=aviso.id))

    # Guardar fotos
    up_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], str(aviso.id))
    os.makedirs(up_dir, exist_ok=True)
    for f in request.files.getlist("fotos"):
        if not f or not f.filename:
            continue
        fname = secure_filename(f.filename)
        dest = os.path.join(up_dir, fname)
        f.save(dest)
        rel_dir = os.path.relpath(
            up_dir, os.path.join(os.path.dirname(__file__), "static")
        ).replace("\\", "/")
        db.session.add(Foto(ruta_archivo=rel_dir, nombre_archivo=fname, aviso_id=aviso.id))

    db.session.commit()
    flash("Hemos recibido la información de adopción, muchas gracias y suerte!", "ok")
    return redirect(url_for("web.index"))


