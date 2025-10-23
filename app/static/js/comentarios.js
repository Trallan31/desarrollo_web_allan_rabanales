// app/static/js/comentarios.js

function $(sel) { return document.querySelector(sel); }
function escapeHTML(str) {
  return (str || "").replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    ...opts
  });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.data = data;
    throw err;
  }
  return data;
}

function setBusy(on) {
  const list = $("#comentarios-lista");
  if (list) list.setAttribute("aria-busy", on ? "true" : "false");
}

function renderComentarios(items) {
  const list = $("#comentarios-lista");
  const total = $("#comentarios-total");
  if (!list || !total) return;

  total.textContent = items.length;
  if (!items.length) {
    list.innerHTML = `<li class="empty">Aún no hay comentarios.</li>`;
    return;
  }

  list.innerHTML = items.map(c => `
    <li class="comentario">
      <div class="meta">
        <span class="nombre">${escapeHTML(c.nombre)}</span>
        <time datetime="${c.fecha}">${escapeHTML(new Date(c.fecha).toLocaleString())}</time>
      </div>
      <p class="texto">${escapeHTML(c.texto)}</p>
    </li>
  `).join("");
}

async function cargarComentarios() {
  const root = $("#comentarios");
  const avisoId = root?.dataset?.avisoId;
  if (!avisoId) return;

  setBusy(true);
  try {
    const data = await fetchJSON(`/api/avisos/${avisoId}/comentarios`);
    renderComentarios(data);
  } catch {
    $("#comentarios-lista").innerHTML = `<li class="empty">No se pudieron cargar los comentarios.</li>`;
  } finally {
    setBusy(false);
  }
}

function limpiarErrores() {
  ["#err-nombre","#err-texto","#err-global"].forEach(id => { const el = $(id); if (el) el.textContent = ""; });
  const ok = $("#ok-global"); if (ok) ok.hidden = true;
}

function validarCliente(nombre, texto) {
  const errors = {};
  if (!nombre || nombre.trim().length < 3) errors.nombre = "Mínimo 3 caracteres.";
  else if (nombre.trim().length > 80) errors.nombre = "Máximo 80 caracteres.";
  if (!texto || texto.trim().length < 5) errors.texto = "Mínimo 5 caracteres.";
  else if (texto.trim().length > 300) errors.texto = "Máximo 300 caracteres.";
  return errors;
}

async function enviarComentario(ev) {
  ev.preventDefault();
  limpiarErrores();

  const root = $("#comentarios");
  const avisoId = root?.dataset?.avisoId;
  const nombre = $("#c-nombre").value;
  const texto  = $("#c-texto").value;

  // Validación cliente
  const localErrors = validarCliente(nombre, texto);
  if (Object.keys(localErrors).length) {
    if (localErrors.nombre) $("#err-nombre").textContent = localErrors.nombre;
    if (localErrors.texto)  $("#err-texto").textContent  = localErrors.texto;
    return;
  }

  try {
    await fetchJSON(`/api/avisos/${avisoId}/comentarios`, {
      method: "POST",
      body: JSON.stringify({ nombre, texto })
    });
    $("#ok-global").hidden = false;
    $("#comentario-form").reset();
    await cargarComentarios();
  } catch (e) {
    const data = e.data || {};
    if (data.errors) {
      if (data.errors.nombre) $("#err-nombre").textContent = data.errors.nombre;
      if (data.errors.texto)  $("#err-texto").textContent  = data.errors.texto;
    } else {
      $("#err-global").textContent = "No se pudo agregar el comentario.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#comentario-form");
  if (form) {
    form.addEventListener("submit", enviarComentario);
    cargarComentarios();
  }
});
