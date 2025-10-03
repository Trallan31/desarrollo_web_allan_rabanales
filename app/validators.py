import re
from datetime import datetime, timedelta
from itertools import zip_longest

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CEL_RE = re.compile(r"^\+\d{3}\.\d{8,10}$")  # +569.12345678

# Valores permitidos
ALLOWED_MEDIA = {"whatsapp", "telegram", "X", "instagram", "tiktok", "otra"}

def _canon_media(s: str | None) -> str | None:
    """
    Normaliza el medio a los valores exactos del enum de BD.
    Devuelve None si viene vacío o no calza.
    """
    if not s:
        return None
    s = s.strip()
    if s.lower() == "x":
        return "X"
    mapping = {
        "whatsapp": "whatsapp",
        "telegram": "telegram",
        "instagram": "instagram",
        "tiktok": "tiktok",
        "otra": "otra",
    }
    return mapping.get(s.lower())

def validate_aviso(form, files, now=None):
    """
    Valida el formulario de 'agregar aviso' según T1 (lado servidor).
    Retorna (ok: bool, errores: list[str]).
    """
    now = now or datetime.now()
    errores = []

    # Región/Comuna
    region_id = (form.get("region_id") or "").strip()
    comuna_id = (form.get("comuna_id") or "").strip()
    if not region_id:
        errores.append("Debe seleccionar una región válida.")
    if not comuna_id:
        errores.append("Debe seleccionar una comuna válida.")

    # Contacto principal
    nombre = (form.get("nombre") or "").strip()
    email = (form.get("email") or "").strip()
    celular = (form.get("celular") or "").strip()  # opcional
    if not (3 <= len(nombre) <= 200):
        errores.append("Nombre debe tener entre 3 y 200 caracteres.")
    if not (email and EMAIL_RE.match(email) and len(email) <= 100):
        errores.append("Email no es válido (máx. 100).")
    if celular and not CEL_RE.match(celular):
        errores.append("Celular debe ser +NNN.NNNNNNNN")

    # Contactar por
    cp_nombres = form.getlist("cp_nombre")
    cp_ids = form.getlist("cp_identificador")
    if len(cp_nombres) > 5:
        errores.append("Puede indicar hasta 5 formas de contacto.")

    for i, (medio_raw, ident_raw) in enumerate(zip_longest(cp_nombres, cp_ids, fillvalue=""), 1):
        medio = _canon_media(medio_raw)
        ident = (ident_raw or "").strip()

        if not medio or not ident:
            continue

        if medio not in ALLOWED_MEDIA:
            errores.append(f"Contacto #{i}: medio inválido.")
            continue

        if not (4 <= len(ident) <= 50):
            errores.append(f"Contacto #{i}: identificador 4-50 chars.")

    # Mascota
    tipo = form.get("tipo")
    cantidad = form.get("cantidad", "0")
    edad = form.get("edad", "0")
    unidad = form.get("unidad_medida")
    if tipo not in {"gato", "perro"}:
        errores.append("Debe seleccionar tipo (gato o perro).")
    if not cantidad.isdigit() or int(cantidad) < 1:
        errores.append("Cantidad debe ser entero ≥ 1.")
    if not edad.isdigit() or int(edad) < 1:
        errores.append("Edad debe ser entero ≥ 1.")
    if unidad not in {"m", "a"}:
        errores.append("Unidad debe ser meses (m) o años (a).")

    # Fecha de entrega (>= ahora + 3h)
    fecha_entrega = (form.get("fecha_entrega") or "").strip()
    try:
        fe = datetime.strptime(fecha_entrega, "%Y-%m-%dT%H:%M")
        if fe < now + timedelta(hours=3):
            errores.append("Fecha de entrega debe ser ≥ (ahora + 3 horas).")
    except Exception:
        errores.append("Fecha de entrega inválida (formato yyyy-mm-ddTHH:MM).")

    # Fotos
    fotos = [f for f in files.getlist("fotos") if getattr(f, "filename", "")]
    if not (1 <= len(fotos) <= 5):
        errores.append("Debe adjuntar entre 1 y 5 fotos.")

    return (len(errores) == 0, errores)

