# Tarea 4 - Desarrollo Web

## Descripción
Esta tarea agrega a la aplicación de adopción una **funcionalidad de evaluación de avisos**, implementada con **Spring Boot + Thymeleaf + JPA (MySQL)** y llamadas **asíncronas en JavaScript**.

La aplicación permite:

- **Listado de avisos de adopción** en `http://localhost:8080/avisos`, mostrando:
  - ID  
  - Fecha publicación  
  - Sector  
  - Cantidad  
  - Tipo / Edad  
  - Comuna  
  - Nota  
  - Acción **Evaluar**
- En la columna **Nota** se muestra:
  - El **promedio** de las notas asociadas al aviso (1 decimal), o
  - Un **“-”** si aún no existen evaluaciones.
- Al hacer clic en **Evaluar**:
  - Se solicita una nota **entera entre 1 y 7** mediante `prompt`.
  - La nota se envía **asíncronamente** via `fetch` al backend.
  - El backend guarda la nota y retorna el **nuevo promedio**.
  - La página **actualiza solo la celda de la nota**, sin recargar.

## Decisiones tomadas
- Se reutiliza la base de datos `tarea2`, manteniendo `aviso_adopcion` y agregando la tabla `nota` mediante `tabla-nota.sql`.
- Se modelaron las entidades con JPA:
  - `AvisoAdopcion`
  - `Nota` (con `@ManyToOne` hacia `AvisoAdopcion`)
- En `AvisoAdopcion` se agregó:
  ```
  @Transient 
  private Double promedioNota;
  ```
  para enviar al template el promedio calculado sin almacenarlo en BD.
- Lado servidor:
  - `AvisoController`:
    - `GET /avisos` obtiene todos los avisos.
    - Calcula el promedio de notas por aviso.
    - Si no hay notas, `promedioNota = null`.
  - `NotaRestController` (API REST):
    - Recibe nuevas notas y valida:
      - Que el aviso exista.
      - Que la nota sea **entera entre 1 y 7**.
    - Guarda la nota y retorna:
      ```
      { "promedio": <valor> }
      ```
- Lado cliente:
  - `static/js/notas.js`:
    - Maneja el clic del botón “Evaluar”.
    - Valida nota entera en [1,7].
    - Envía con `fetch` la evaluación.
    - Actualiza la celda del promedio dinámicamente.
  - `templates/avisos.html`:
    - Lista los avisos con `th:each`.
    - Muestra promedio formateado o “-”.
    - Botón con `data-aviso-id` para JS.

## Extra / Dificultades encontradas
- **Validación de notas enteras:**  
  Se corrigió la aceptación errónea de decimales, validando tanto en frontend como backend.
- **Promedio sin modificar la BD:**  
  No se agregó un campo nuevo; se usa un atributo `@Transient` y se calcula al vuelo.
- **Actualización sin recargar página:**  
  Implementado con `fetch` y manipulación del DOM. Se maneja error de red o estado HTTP incorrecto mostrando alertas.

## Para la corrección
- Levantar la aplicación y entrar a:  
  **http://localhost:8080/avisos**
- La base de datos debe ser `tarea2` con la tabla `nota` creada mediante el script entregado.