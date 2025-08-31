// js/detalle.js
// Lightbox para ampliar fotos en detalle.html
// Modal con <dialog> para ampliar fotos (ventanita emergente)
(function () {
    const thumbs = document.querySelectorAll(".thumb-btn[data-large]");
    if (!thumbs.length) return;

    const dlg = document.getElementById("imgModal");
    const img = document.getElementById("modal-img");
    const btnClose = document.getElementById("modal-close");

    const PLACEHOLDER =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    function open(src) {
        img.setAttribute("src", src);
        if (typeof dlg.showModal === "function") {
            dlg.showModal();
        } else {
            // Fallback muy básico si el navegador no soporta <dialog>
            dlg.setAttribute("open", "");
        }
        btnClose.focus();
    }

    function close() {
        img.setAttribute("src", PLACEHOLDER);
        if (typeof dlg.close === "function") dlg.close();
        else dlg.removeAttribute("open");
    }

    thumbs.forEach(b => b.addEventListener("click", () => open(b.dataset.large)));
    btnClose.addEventListener("click", close);

    // Cerrar al hacer clic fuera del contenido
    dlg.addEventListener("click", (e) => {
        const rect = dlg.querySelector(".modal-body").getBoundingClientRect();
        const clickOutside =
            e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom;
        if (clickOutside) close();
    });

    // Esc para cerrar
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dlg.open) close();
    });
})();
