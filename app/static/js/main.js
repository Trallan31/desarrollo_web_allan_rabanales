// select dependiente región -> comuna
document.addEventListener("DOMContentLoaded", () => {
  const region = document.getElementById("region");
  const comuna = document.getElementById("comuna");

  if (region && comuna) {
    const loadComunas = async (rid) => {
      comuna.innerHTML = '<option value="">Seleccione una comuna</option>';
      comuna.disabled = true;
      if (!rid) return;
      const res = await fetch(`/api/comunas?region_id=${encodeURIComponent(rid)}`);
      const data = await res.json();
      for (const c of data) {
        const opt = document.createElement("option");
        opt.value = c.id; opt.textContent = c.nombre;
        comuna.appendChild(opt);
      }
      comuna.disabled = false;
    };

    region.addEventListener("change", () => loadComunas(region.value));

    if (region.value) loadComunas(region.value);
  }

  // boton "agregar otra foto"
  const fotosWrap = document.getElementById("fotosWrap");
  const addFoto = document.getElementById("addFoto");
  if (addFoto && fotosWrap) {
    addFoto.addEventListener("click", () => {
      const count = fotosWrap.querySelectorAll('input[type="file"]').length;
      if (count >= 5) return alert("Máximo 5 fotos");
      const input = document.createElement("input");
      input.type = "file"; input.name = "fotos"; input.accept = "image/*";
      fotosWrap.appendChild(input);
    });
  }

  // redes
  const addContact = document.getElementById("addContact");
  const contactMethods = document.getElementById("contactMethods");
  if (addContact && contactMethods) {
    addContact.addEventListener("click", () => {
      const count = contactMethods.querySelectorAll(".cm-row").length;
      if (count >= 5) return alert("Máximo 5 contactos");
      const row = contactMethods.firstElementChild.cloneNode(true);
      row.querySelector('select[name="cp_nombre"]').value = "";
      row.querySelector('input[name="cp_identificador"]').value = "";
      contactMethods.appendChild(row);
    });
  }

  const modal = document.getElementById("imgModal");
  const big = document.getElementById("bigImg");
  document.querySelectorAll(".thumb-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      big.src = btn.dataset.big;
      modal.showModal();
    });
  });

  // confirmacion
  const submitAviso = document.getElementById("submitAviso");
  const form = submitAviso ? submitAviso.closest("form") : null;
  if (form && submitAviso) {
    form.addEventListener("submit", (e) => {
      const ok = confirm("¿Está seguro que desea agregar este aviso de adopción?");
      if (!ok) e.preventDefault();
    });
  }
});
