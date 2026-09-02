# Plataforma de Adopción de Mascotas

Aplicación web full-stack desarrollada con Flask (Python) y MySQL, con funcionalidades dinámicas implementadas mediante AJAX (fetch API). El sistema permite publicar, listar, consultar y comentar avisos de adopción de mascotas, además de visualizar estadísticas interactivas.

## Tecnologías

- **Backend:** Python, Flask, SQLAlchemy (ORM), MySQL
- **Frontend:** HTML5, CSS3, JavaScript (vanilla), Highcharts
- **Arquitectura:** MVC con separación de modelos, rutas y validadores
- **API:** Endpoints REST para comentarios y estadísticas con respuesta JSON
- **Validación:** Doble capa (cliente y servidor) con mensajes accesibles (ARIA)

## Funcionalidades principales

- **Portada dinámica:** Muestra los últimos 5 avisos de adopción obtenidos desde la base de datos.
- **Publicación de avisos:** Formulario con validación en JavaScript y Python. Al enviar, inserta datos en las tablas `aviso_adopcion`, `contactar_por` y `foto`, y almacena las imágenes en disco.
- **Listado paginado:** Visualización de avisos con paginación de 5 filas por pagina y navegación Anterior / Siguiente.
- **Detalle de aviso:** Vista completa con información y galería de fotos ampliables en modal.
- **Comentarios asincrónicos:** Carga y envió de comentarios vía AJAX (`fetch`) con validación en cliente y servidor, actualización del listado sin recarga de pagina.
- **Estadísticas interactivas:** Tres gráficos dinámicos generados desde la base de datos y renderizados con Highcharts:
  - Linea: avisos publicados en los últimos 7 días
  - Torta: distribución por tipo de mascota
  - Barras agrupadas: avisos por mes y tipo (filtrable por anio)

## Arquitectura del proyecto
app/
├── models.py          # Modelos SQLAlchemy (AvisoAdopcion, Comentario, ContactarPor, Foto)
├── routes.py          # Rutas Flask y endpoints API REST
├── validators.py      # Validaciones de formularios (Python)
├── static/
│   ├── js/
│   │   ├── comentarios.js     # Lógica AJAX de comentarios
│   │   └── estadisticas.js    # Consumo de API y renderizado de gráficos
│   └── uploads/               # Almacenamiento de fotos subidas
└── templates/         # Vistas HTML (Jinja2)

## Decisiones técnicas destacadas

- **API REST para estadísticas:** Se implementaron 3 endpoints independientes (`/api/estadisticas/por-dia`, `/api/estadisticas/por-tipo`, `/api/estadisticas/por-mes`) que devuelven datos en JSON, desacoplando la lógica de presentación del backend.
- **Sanitización de SVG:** Se eliminaron atributos no validos generados por Highcharts (`text-align`, `transform-origin`) para garantizar compatibilidad con validadores HTML.
- **Manejo de fechas:** Uso de `datetime.utcnow()` desde Flask para compatibilidad con MySQL, ante la ausencia de `DEFAULT CURRENT_TIMESTAMP` en el esquema.
- **Accesibilidad:** Mensajes de validación implementados con `aria-live` para lectores de pantalla.
- **Carga segura de librerías:** Highcharts cargado desde CDN con atributo `defer`, asegurando que los scripts de fetch solo se ejecuten una vez disponible la librería.

## Instalación y ejecución

1. Clonar el repositorio
2. Crear entorno virtual: `python -m venv venv`
3. Activar: `source venv/bin/activate` (Linux/Mac) o `venv\Scripts\activate` (Windows)
4. Instalar dependencias: `pip install -r requirements.txt`
5. Configurar base de datos MySQL y actualizar credenciales en `config.py`
6. Ejecutar: `flask run`
