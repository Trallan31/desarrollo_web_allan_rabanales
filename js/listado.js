// Navegar al detalle con clic o teclado
(function () {
    const filas = document.querySelectorAll(".fila-detalle[data-link]");
    filas.forEach(fila => {
        fila.tabIndex = 0;
        const go = () => window.location.href = fila.getAttribute("data-link");
        fila.addEventListener("click", go);
        fila.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
    });
})();