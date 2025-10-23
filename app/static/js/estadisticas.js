async function fetchJSON(url) {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${msg}`);
  }
  return res.json();
}

function showEmptyState(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div style="padding:1rem;border:1px dashed #bbb;border-radius:8px;text-align:center;">${message}</div>`;
}

function sanitizeChart(containerId) {
  const root = document.getElementById(containerId);
  if (!root) return;
  const svg = root.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('[text-align]').forEach(n => n.removeAttribute('text-align'));
  svg.querySelectorAll('[transform-origin]').forEach(n => n.removeAttribute('transform-origin'));
}

function renderPorDia(data) {
  if (!window.Highcharts) {
    showEmptyState("grafico-por-dia", "No se pudo cargar la librería de gráficos.");
    return;
  }
  // data = [{fecha:"YYYY-MM-DD", cantidad:int}, ...]
  if (!data || data.length === 0) {
    showEmptyState("grafico-por-dia", "Sin datos para el período.");
    return;
  }
  const seriesData = data.map(d => [Date.parse(d.fecha + "T00:00:00"), d.cantidad]);
  Highcharts.chart("grafico-por-dia", {
    chart: {
      events: {
        load() { sanitizeChart("grafico-por-dia"); },
        redraw() { sanitizeChart("grafico-por-dia"); }
      }
    },
    credits: { enabled: false },
    title: { text: null },
    subtitle: { text: null },
    caption: { text: null },
    xAxis: { type: "datetime" },
    yAxis: { title: { text: "Avisos" }, allowDecimals: false },
    legend: { enabled: false },
    tooltip: { shared: true },
    series: [{ name: "Avisos", data: seriesData }]
  });
}

function renderPorTipo(data) {
  if (!window.Highcharts) {
    showEmptyState("grafico-torta-tipo", "No se pudo cargar la librería de gráficos.");
    return;
  }
  if (!data || data.length === 0) {
    showEmptyState("grafico-torta-tipo", "Sin datos disponibles.");
    return;
  }
  const seriesData = data.map(d => ({ name: d.tipo ?? "desconocido", y: d.cantidad }));
  Highcharts.chart("grafico-torta-tipo", {
    chart: {
      type: "pie",
      events: {
        load() { sanitizeChart("grafico-torta-tipo"); },
        redraw() { sanitizeChart("grafico-torta-tipo"); }
      }
    },
    credits: { enabled: false },
    title: { text: null },
    subtitle: { text: null },
    caption: { text: null },
    tooltip: { pointFormat: "<b>{point.y} avisos</b> ({point.percentage:.1f}%)" },
    series: [{ name: "Tipo", data: seriesData }]
  });
}

function renderPorMes(data) {
  if (!window.Highcharts) {
    showEmptyState("grafico-barras-mes", "No se pudo cargar la librería de gráficos.");
    return;
  }
  if (!data || data.length === 0) {
    showEmptyState("grafico-barras-mes", "Sin datos para el año seleccionado.");
    return;
  }
  const meses = Array.from(new Set(data.map(d => d.mes))).sort((a,b)=>a-b);
  const tipos = Array.from(new Set(data.map(d => d.tipo || "desconocido")));

  const series = tipos.map(tipo => {
    const porTipo = new Map(
      data.filter(d => (d.tipo || "desconocido") === tipo)
          .map(d => [d.mes, d.cantidad])
    );
    const valores = meses.map(m => porTipo.get(m) || 0);
    return { name: tipo, data: valores };
  });

  Highcharts.chart("grafico-barras-mes", {
    chart: {
      type: "column",
      events: {
        load() { sanitizeChart("grafico-barras-mes"); },
        redraw() { sanitizeChart("grafico-barras-mes"); }
      }
    },
    credits: { enabled: false },
    title: { text: null },
    subtitle: { text: null },
    caption: { text: null },
    xAxis: {
      categories: meses.map(m => ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][m-1] || `Mes ${m}`),
      crosshair: true
    },
    yAxis: { min: 0, title: { text: "Avisos" }, allowDecimals: false },
    tooltip: { shared: true },
    plotOptions: { column: { pointPadding: 0.1, borderWidth: 0 } },
    series
  });
}

async function initEstadisticas() {
  console.log("Init estadísticas…");

  try {
    const porDia = await fetchJSON("/api/estadisticas/por-dia?dias=7");
    renderPorDia(porDia);
  } catch (err) {
    console.error("por-dia:", err);
    showEmptyState("grafico-por-dia", "Error cargando datos.");
  }

  try {
    const porTipo = await fetchJSON("/api/estadisticas/por-tipo");
    renderPorTipo(porTipo);
  } catch (err) {
    console.error("por-tipo:", err);
    showEmptyState("grafico-torta-tipo", "Error cargando datos.");
  }

  try {
    const porMes = await fetchJSON(`/api/estadisticas/por-mes?anio=${new Date().getFullYear()}`);
    renderPorMes(porMes);
  } catch (err) {
    console.error("por-mes:", err);
    showEmptyState("grafico-barras-mes", "Error cargando datos.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEstadisticas();
});

