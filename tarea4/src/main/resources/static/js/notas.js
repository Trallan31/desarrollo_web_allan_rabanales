document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-evaluar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const avisoId = btn.dataset.avisoId;
      let valor = prompt("Ingrese una nota ENTERA entre 1 y 7:");

      if (valor === null) {
        return; // cancelado
      }

      // Convertir a número
      valor = Number(valor);

      // Validar que sea entero
      if (!Number.isInteger(valor)) {
        alert("La nota debe ser un número ENTERO entre 1 y 7");
        return;
      }

      // Validar rango
      if (valor < 1 || valor > 7) {
        alert("La nota debe estar entre 1 y 7");
        return;
      }

      try {
        const resp = await fetch(`/api/avisos/${avisoId}/notas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ nota: valor })
        });

        if (!resp.ok) {
          alert("Error al guardar la nota");
          return;
        }

        const data = await resp.json();
        const promedio = data.promedio;

        const fila = btn.closest("tr");
        const celdaNota = fila.querySelector("td:nth-child(8)"); // 8va columna: Nota
        celdaNota.textContent = promedio.toFixed(1);
      } catch (e) {
        console.error(e);
        alert("Error de red al guardar la nota");
      }
    });
  });
});
