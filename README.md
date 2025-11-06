# Tarea 3 - Desarrollo Web

## Descripción
Esta tarea extiende el prototipo de la **Tarea 2**, manteniendo la aplicación en **Flask (Python)** con base de datos **MySQL + SQLAlchemy**, pero ahora incorporando funcionalidades **dinámicas mediante AJAX (fetch / Promesas)**.

La aplicación permite:
- **Portada** con mensaje de bienvenida, menú y los últimos 5 avisos reales desde la base de datos.
- **Formulario de agregar aviso** con validaciones en **JavaScript** y **Python** (lado servidor). Al enviar, inserta en las tablas `aviso_adopcion`, `contactar_por` y `foto`, y guarda las fotos en disco.
- **Listado de avisos** obtenido desde la base de datos, en páginas de 5 filas, con navegación Anterior / Siguiente.
- **Detalle de aviso** cargado desde la BD, mostrando toda la información y fotos ampliables en un modal.
- **Comentarios** cargados y enviados de forma **asíncrona (AJAX)** con `fetch()`, con validaciones tanto del lado del **cliente** como del **servidor**.
- **Estadísticas dinámicas** generadas desde la BD mediante **3 endpoints Flask** y graficadas en el cliente con **Highcharts**.

## Decisiones tomadas
- Mantener el **diseño general y estructura Flask** de la T2, extendiendo la funcionalidad:
  - `app/models.py` → se agregó el modelo **Comentario** y la relación con `AvisoAdopcion`.
  - `app/routes.py` → se añadieron rutas API para **comentarios** y **estadísticas**.
  - `app/validators.py` → se incluyó `validate_comentario` con las reglas requeridas.
  - `app/static/js/comentarios.js` → carga, validación y envío de comentarios usando `fetch()`.
  - `app/static/js/estadisticas.js` → obtiene datos vía `fetch()` y renderiza 3 gráficos con **Highcharts**.
- Las **estadísticas** cumplen el uso de *AJAX o Promesas con XHR*, implementado mediante la **API moderna `fetch()`**:
  - `/api/estadisticas/por-dia?dias=7` → gráfico de líneas (últimos 7 días).
  - `/api/estadisticas/por-tipo` → gráfico de torta (total por tipo).
  - `/api/estadisticas/por-mes?anio=YYYY` → gráfico de barras agrupadas (por mes y tipo).
- Para **validación HTML**, se sanitizan los SVG generados por Highcharts, eliminando atributos no válidos (`text-align`, `transform-origin`)
- Se usó `datetime.utcnow()` al crear un comentario para compatibilidad con MySQL, ya que la columna `fecha` no tenía un valor por defecto.
- En el formulario de comentarios:
  - Validación **cliente (JS)** y **servidor (Python)** con mensajes accesibles (`aria-live`).
  - Inserción y actualización del listado **sin recargar la página**.

## Extra / Dificultades encontradas
- El campo `fecha` de la tabla `comentario` en MySQL no tenía `DEFAULT CURRENT_TIMESTAMP`, por lo que se producía un error al insertar.  
  **Solución:** agregar `fecha=datetime.utcnow()` desde Flask al crear el comentario.
- Algunos atributos generados automáticamente por Highcharts (`text-align`, `transform-origin`) generaban errores en el validador HTML.  
  **Solución:** sanitizar los SVG luego del renderizado eliminando dichos atributos, y desactivar los créditos de Highcharts.
- Para evitar problemas de CORS y asegurar validación local, se cargó **Highcharts desde CDN con `defer`**, y se ejecutan los fetch solo al tener la librería disponible.
- En los comentarios, se reforzó la validación del lado cliente para que no se envíen campos vacíos o menores al tamaño mínimo.
