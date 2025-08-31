// js/agregar.js  (actualizado: mostrar botón "Agregar otra foto" solo tras cargar 1era foto)
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const form = $("#form-aviso");
  const selRegion = $("#region");
  const selComuna = $("#comuna");
  const selContactarPor = $("#contactarPor");
  const contRed = $("#redes-sociales-container");
  const fechaDisponible = $("#fechaDisponible");
  const erroresBox = $("#errores");
  const fotosContainer = $("#fotos-container");
  const btnAgregarFoto = $("#btnAgregarFoto");
  const dialogo = $("#confirmDialog");
  const exito = $("#exito");

  // ===== Fecha: prellenar ahora + 3h =====
  let fechaMinPermitidaISO = null;
  function prellenarFecha() {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    fechaMinPermitidaISO = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    if (fechaDisponible) fechaDisponible.value = fechaMinPermitidaISO;
  }

  // ===== Regiones y comunas =====
  function obtenerRegiones() {
    try {
      if (typeof region_comuna !== "undefined" && Array.isArray(region_comuna.regiones)) {
        return region_comuna.regiones.map(r => r.nombre);
      }
    } catch (_) {}
    console.warn("No se encontró 'region_comuna.regiones'. Revisa que region_comuna.js cargue antes que agregar.js");
    return [];
  }

  function obtenerComunasDe(regionNombre) {
    try {
      const regiones = (typeof region_comuna !== "undefined") ? region_comuna.regiones : [];
      const reg = regiones.find(r => r.nombre === regionNombre);
      return reg ? reg.comunas.map(c => c.nombre) : [];
    } catch (_) {
      return [];
    }
  }

  function poblarRegiones() {
    const regiones = obtenerRegiones();
    selRegion.innerHTML =
      `<option value="">Seleccione una región</option>` +
      regiones.map(r => `<option value="${r}">${r}</option>`).join("");
  }

  function poblarComunas() {
    const regionSel = selRegion.value;
    const comunas = regionSel ? obtenerComunasDe(regionSel) : [];
    selComuna.innerHTML =
      `<option value="">Selecciones una comuna</option>` +
      comunas.map(c => `<option value="${c}">${c}</option>`).join("");
    selComuna.disabled = comunas.length === 0;
  }

  // ===== Contactar por: input extra según selección =====
  function renderRedSocialExtra() {
    contRed.innerHTML = "";
    const v = selContactarPor.value;
    if (!v) return;

    const label = document.createElement("label");
    label.setAttribute("for", "contactoRed");
    label.textContent =
      v === "Whatsapp" ? "Número o enlace de WhatsApp" :
      v === "Telegram" ? "Usuario o enlace de Telegram" :
      v === "X" ? "Usuario de X" :
      v === "Instagram" ? "Usuario de Instagram" :
      v === "Tiktok" ? "Usuario de TikTok" :
      "Usuario/URL";

    const input = document.createElement("input");
    input.id = "contactoRed";
    input.name = "contactoRed";
    input.type = "text";
    input.maxLength = 150;
    input.placeholder =
      v === "Whatsapp" ? "Ej: +56912345678 o https://wa.me/56912345678" : "Ej: @usuario o enlace";

    contRed.appendChild(label);
    contRed.appendChild(input);
  }

  // ===== Fotos (mín 1, máx 5) =====
  function updateFotosUI() {
    const inputs = $$("input[type='file']", fotosContainer);
    const algunoConArchivo = inputs.some(i => i.files && i.files.length > 0);
    const total = inputs.length;

    btnAgregarFoto.hidden = !algunoConArchivo;
    // Deshabilitar si ya se crearon 5 inputs
    btnAgregarFoto.disabled = total >= 5;
  }

  function crearInputFoto() {
    const idx = $$("input[type='file']", fotosContainer).length + 1;
    const wrap = document.createElement("div");
    wrap.className = "foto-item";

    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto[]";
    input.accept = "image/*";
    input.setAttribute("aria-label", `Foto ${idx}`);

    input.addEventListener("change", updateFotosUI);

    wrap.appendChild(input);
    fotosContainer.appendChild(wrap);
    updateFotosUI();
  }

  function inicializarFotos() {
    // Creamos el primer input
    crearInputFoto();
    btnAgregarFoto.hidden = true;

    btnAgregarFoto.addEventListener("click", () => {
      const actuales = $$("input[type='file']", fotosContainer).length;
      if (actuales >= 5) {
        alert("No puedes agregar más de 5 fotos.");
        return;
      }
      crearInputFoto();
    });
  }

  function contarInputsConArchivo() {
    return $$("input[type='file']", fotosContainer)
      .filter(i => i.files && i.files.length > 0).length;
  }

  // ===== Errores UI =====
  function limpiarErrores() {
    if (!erroresBox) return;
    erroresBox.hidden = true;
    erroresBox.innerHTML = "";
  }
  function mostrarErrores(lista) {
    if (!erroresBox) return;
    if (!lista || lista.length === 0) return;
    erroresBox.hidden = false;
    erroresBox.innerHTML = `<ul>${lista.map(e => `<li>${e}</li>`).join("")}</ul>`;
    erroresBox.focus?.();
  }

  // ===== Payload para validaciones.js =====
  function recolectarPayload() {
    const canal = selContactarPor.value || "";
    const extra = $("#contactoRed")?.value || "";
    const redes = canal ? [{ canal, valor: extra }] : [];

    const tipo = document.querySelector('input[name="tipo"]:checked')?.value || "";
    const unidadEdad = document.querySelector('input[name="unidadEdad"]:checked')?.value || "";

    return {
        lugar: {
            region: selRegion.value,
            comuna: selComuna.value,
            sector: $("#sector")?.value || "",
        },
        contacto: {
            nombre: $("#nombre")?.value || "",
            email: $("#email")?.value || "",
            celular: $("#celular")?.value || "",
            redes,
        },
        mascota: {
            tipo,
            cantidad: $("#cantidad")?.value || "",
            edad: $("#edad")?.value || "",
        unidadEdad,
            fechaDisponible: $("#fechaDisponible")?.value || "",
            fechaMinPermitida: fechaMinPermitidaISO,
        },
        fotos: {
            totalInputsConArchivo: contarInputsConArchivo(),
        },
      };
    }


  // ===== Confirmación / Éxito =====
  function mostrarConfirmacion(onSi, onNo) {
    if (typeof dialogo?.showModal === "function") {
      dialogo.showModal();
      const btnSi = $("#confirmSi", dialogo);
      const btnNo = $("button[value='no']", dialogo);

      const onSiH = () => { dialogo.close(); cleanup(); onSi(); };
      const onNoH = () => { dialogo.close(); cleanup(); onNo && onNo(); };
      const cleanup = () => {
        btnSi?.removeEventListener("click", onSiH);
        btnNo?.removeEventListener("click", onNoH);
      };

      btnSi?.addEventListener("click", onSiH);
      btnNo?.addEventListener("click", onNoH);
    } else {
      if (confirm("¿Está seguro que desea agregar este aviso de adopción?")) onSi();
      else onNo && onNo();
    }
  }

  function mostrarExito() {
    form.hidden = true;
    exito.hidden = false;
    exito.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ===== Eventos =====
  document.addEventListener("DOMContentLoaded", () => {
    prellenarFecha();
    poblarRegiones();
    inicializarFotos();
  });

  selRegion.addEventListener("change", poblarComunas);
  selContactarPor.addEventListener("change", renderRedSocialExtra);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores();

    const payload = recolectarPayload();
    const resultado = window.Validaciones.validarTodo(payload);
    if (!resultado.ok) {
      mostrarErrores(resultado.errores);
      return;
    }

    mostrarConfirmacion(
      () => { mostrarExito(); },
      () => {}
    );
  });
})();
