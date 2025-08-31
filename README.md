# Tarea 1 - Desarrollo Web

## Descripción
La tarea consiste en un prototipo de sistema de adopción de mascotas. 
La aplicación no guarda datos reales ni requiere servidor; se enfoca en mostrar las interfaces, la validación de formularios y la navegación entre pantallas.

Incluye:
- **Portada** con los últimos 5 avisos de adopción.
- **Formulario** para agregar un aviso con validaciones en JS.
- **Listado** de avisos de ejemplo.
- **Detalle** de un aviso con fotos ampliables.
- **Estadísticas** representadas con tres gráficos estáticos.

## Decisiones tomadas
- Mantener un **diseño consistente** en todas las páginas, reutilizando cabecera, menú y pie de página.
- Definir **variables CSS** para colores y estilos básicos (`--bg`, `--brand`, `--border`) que facilitan mantener la coherencia visual.
- Separar la lógica en varios archivos JS:
  - `portada.js` → muestra los últimos 5 avisos en la portada.
  - `agregar.js` → controla el formulario (regiones, comunas, validaciones y fotos).
  - `listado.js` → hace que las filas de la tabla sean clickeables.
  - `detalle.js` → permite ampliar fotos en una ventana modal con `<dialog>`.
  - `region_comuna.js` → contiene las regiones y comunas de Chile.
  - `validaciones.js` → centraliza todas las validaciones del formulario.
- Para los **gráficos** (punto 4) se eligió usar **SVG estáticos**.
- Validar todos los formularios solo con **JavaScript** (no con `required`).
- Usar un **modal con `<dialog>`** para confirmar la creación de un aviso y para ampliar las fotos, mejorando la experiencia de usuario.
- Asegurar que todo el código pase las validaciones de **HTML y CSS del W3C** para evitar descuentos.