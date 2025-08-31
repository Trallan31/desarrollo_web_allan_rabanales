// js/portada.js

const avisosPortada = [
  {
    id: "A-001",
    fechaPublicacion: "2025-08-18 12:00",
    comuna: "Santiago",
    sector: "Beauchef 850, terraza",
    cantidad: 1,
    tipo: "gato",
    edad: "2 meses",
    foto: "./img/mascotas/gato1.jpg",
  },
  {
    id: "A-002",
    fechaPublicacion: "2025-08-17 19:00",
    comuna: "Ñuñoa",
    sector: "Plaza",
    cantidad: 3,
    tipo: "perros",
    edad: "2 meses",
    foto: "./img/mascotas/perros1.png",
  },
  {
    id: "A-003",
    fechaPublicacion: "2025-08-17 18:00",
    comuna: "Santiago",
    sector: "Parque O’Higgins",
    cantidad: 2,
    tipo: "gatos",
    edad: "1 mes",
    foto: "./img/mascotas/gatos1.jpg",
  },
  {
    id: "A-004",
    fechaPublicacion: "2025-08-16 11:30",
    comuna: "Providencia",
    sector: "Pedro de Valdivia",
    cantidad: 1,
    tipo: "perro",
    edad: "10 meses",
    foto: "./img/mascotas/perro1.png",
  },
  {
    id: "A-005",
    fechaPublicacion: "2025-08-15 09:15",
    comuna: "La Florida",
    sector: "Vicuña Mackenna",
    cantidad: 2,
    tipo: "gatos",
    edad: "1 año",
    foto: "./img/mascotas/gatos2.jpg",
  },
];

function renderAvisos() {
  const tbody = document.getElementById("tabla-ultimos-tbody");
  if (!tbody) return;

  tbody.innerHTML = avisosPortada.map(a => `
    <tr>
      <td>${a.fechaPublicacion}</td>
      <td>${a.comuna}</td>
      <td>${a.sector}</td>
      <td>${a.cantidad}</td>
      <td>${a.tipo}</td>
      <td>${a.edad}</td>
      <td>
        <img class="thumb" src="${a.foto}" 
             alt="Foto aviso ${a.id} (${a.tipo})" 
             width="120" height="90">
      </td>
    </tr>
  `).join("");
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", renderAvisos);
