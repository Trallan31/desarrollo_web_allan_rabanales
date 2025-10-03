# Tarea 2 - Desarrollo Web

## Descripción
Esta tarea extiende el prototipo de la **Tarea 1**, pero ahora implementando las funcionalidades con **Flask (Python)** y una base de datos **MySQL** mediante **SQLAlchemy**.

La aplicación permite:
- **Portada** con mensaje de bienvenida, menú y los últimos 5 avisos reales desde la BD.
- **Formulario de agregar aviso** con validaciones en **JavaScript** y **Python** (lado servidor). Al enviar, inserta en las tablas `aviso_adopcion`, `contactar_por` y `foto`, y guarda las fotos en disco.
- **Listado de avisos** obtenido desde la BD, en páginas de 5 filas, con navegación Anterior/Siguiente.
- **Detalle de aviso** cargado desde la BD, mostrando toda la información y fotos ampliables en un modal.
- **Estadísticas** representadas con tres gráficos estáticos.

## Decisiones tomadas
- Mantener el **diseño de Tarea 1** (misma cabecera, menú y pie de página), adaptando el formulario para integrarlo con Flask y SQLAlchemy.
- Definir una **estructura de proyecto Flask**:
  - `app/__init__.py` → configuración de Flask y DB.
  - `app/models.py` → mapeo de tablas con SQLAlchemy.
  - `app/routes.py` → vistas de portada, agregar, listado, detalle y estadísticas.
  - `app/validators.py` → validaciones del formulario en el servidor.
  - `app/templates/` → templates HTML (con Jinja).
  - `app/static/` → CSS, JS y carpeta `uploads/` para fotos.
- En el formulario de **agregar aviso**:
  - Validaciones en **cliente (JS)** con `required`, confirmación antes de enviar y dinámicas (agregar más fotos/contactos).
  - Validaciones en **servidor (Python)**: región, comuna, nombre, email, fecha ≥ +3h, fotos (1–5), etc.
  - Los campos opcionales (`celular`, `contactar por`) no bloquean la inserción si se dejan vacíos.
- Para las **fotos**:
  - Se almacenan en `app/static/uploads/<id_aviso>/`.
  - Se normalizan rutas con `/` para evitar problemas en Windows.
- Para las **estadísticas**:
  - Se movieron a una página aparte (`/estadisticas`) como lo pide T2.
  - Se mantienen los gráficos estáticos en SVG de T1.
- En la **Tarea 1** tenía varios archivos JS separados (`portada.js`, `agregar.js`, `listado.js`, etc.).  
  En esta **Tarea 2** decidí consolidarlos en un único archivo `main.js` para simplificar la organización.

## Extra / Dificultades encontradas
Durante el traspaso desde la Tarea 1 hacia esta Tarea 2 tuve varios inconvenientes:

- En algunos intentos iniciales la aplicación no lograba recibir correctamente los datos desde la base de datos o no procesaba bien el envío de un aviso nuevo.
- Estos problemas se relacionaban principalmente con la integración de Jinja y la adaptación del formulario de T1 al flujo de Flask + SQLAlchemy.
- Para asegurar que el flujo de agregar aviso funcionara correctamente decidí rehacer esa parte desde cero, tomando como base lo que ya tenía de T1 pero ajustado al modelo de la base de datos.
- Como consecuencia, algunos aspectos visuales de la aplicación (por ejemplo tamaños de elementos o disposición en la página) pueden diferir levemente de la versión de T1, pero se mantiene la funcionalidad completa solicitada en el enunciado.
