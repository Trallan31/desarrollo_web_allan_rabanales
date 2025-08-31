// js/validaciones.js
// Todas las validaciones centralizadas aquí (sin usar 'required').

window.Validaciones = (function () {
  const errores = [];

  // Utilidades
  const isEmpty = v => v === null || v === undefined || String(v).trim() === "";
  const isInt = v => Number.isInteger(Number(v));
  const asInt = v => parseInt(v, 10);

  function validarLugar({ region, comuna, sector }) {
    if (isEmpty(region)) errores.push("Debe seleccionar una región.");
    if (isEmpty(comuna)) errores.push("Debe seleccionar una comuna.");
    if (!isEmpty(sector) && String(sector).length > 100) {
      errores.push("El sector no puede superar 100 caracteres.");
    }
  }

  function validarContacto({ nombre, email, celular, redes }) {
    // nombre: obligatorio, min 3, max 200
    if (isEmpty(nombre)) {
      errores.push("El nombre es obligatorio.");
    } else {
      const len = String(nombre).trim().length;
      if (len < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
      if (len > 200) errores.push("El nombre no puede superar 200 caracteres.");
    }

    // email: obligatorio, formato email, max 100
    if (isEmpty(email)) {
      errores.push("El email es obligatorio.");
    } else {
      if (String(email).length > 100) errores.push("El email no puede superar 100 caracteres.");
      // Usa la validación nativa del navegador si existe
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
      if (!ok) errores.push("El email no cumple el formato válido.");
    }

    // celular: opcional, formato +NNN.NNNNNNNN (ej: +569.12345678)
    if (!isEmpty(celular)) {
      const telOk = /^\+\d{3}\.\d{8}$/.test(String(celular));
      if (!telOk) errores.push("El celular debe tener formato +NNN.NNNNNNNN (ej: +569.12345678).");
    }

    // redes: opcional, máximo 5, cada valor 4-50 caracteres
    if (redes && redes.length > 0) {
      if (redes.length > 5) errores.push("Puede seleccionar como máximo 5 redes de contacto.");
      redes.forEach(({ canal, valor }) => {
        if (!isEmpty(valor)) {
          const L = String(valor).trim().length;
          if (L < 4 || L > 50) {
            errores.push(`El identificador/URL de ${canal} debe tener entre 4 y 50 caracteres.`);
          }
        }
      });
    }
  }

  function validarMascota({ tipo, cantidad, edad, unidadEdad, fechaDisponible, fechaMinPermitida }) {
    // tipo: obligatorio (gato o perro)
    if (isEmpty(tipo)) errores.push("Debe seleccionar el tipo de mascota (gato o perro).");
    else if (!["gato", "perro"].includes(String(tipo))) errores.push("El tipo debe ser 'gato' o 'perro'.");

    // cantidad: entero, min 1
    if (isEmpty(cantidad)) errores.push("Debe indicar la cantidad.");
    else if (!isInt(cantidad)) errores.push("La cantidad debe ser un número entero.");
    else if (asInt(cantidad) < 1) errores.push("La cantidad mínima es 1.");

    // edad: entero, min 1
    if (isEmpty(edad)) errores.push("Debe indicar la edad.");
    else if (!isInt(edad)) errores.push("La edad debe ser un número entero.");
    else if (asInt(edad) < 1) errores.push("La edad mínima es 1.");

    // unidadEdad: obligatorio (meses o años)
    if (isEmpty(unidadEdad)) errores.push("Debe seleccionar la unidad de edad (meses/años).");
    else if (!["meses", "años"].includes(String(unidadEdad))) errores.push("La unidad de edad debe ser 'meses' o 'años'.");

    // fechaDisponible: obligatorio, >= fechaMinPermitida (prellenada)
    if (isEmpty(fechaDisponible)) errores.push("Debe indicar la fecha disponible para entrega.");
    else {
      const ingresada = new Date(fechaDisponible);
      const min = new Date(fechaMinPermitida);
      if (isNaN(ingresada.getTime())) {
        errores.push("La fecha disponible no cumple el formato año-mes-día hora:minuto.");
      } else if (ingresada.getTime() < min.getTime()) {
        errores.push("La fecha disponible debe ser mayor o igual a la fecha/hora prellenada.");
      }
    }
  }

  function validarFotos({ totalInputsConArchivo }) {
    // mínimo 1 foto, máximo 5
    if (totalInputsConArchivo < 1) errores.push("Debe seleccionar al menos 1 foto.");
    if (totalInputsConArchivo > 5) errores.push("No puede seleccionar más de 5 fotos.");
  }

  function validarTodo(payload) {
    errores.length = 0;
    validarLugar(payload.lugar);
    validarContacto(payload.contacto);
    validarMascota(payload.mascota);
    validarFotos(payload.fotos);
    return { ok: errores.length === 0, errores: [...errores] };
  }

  return {
    validarTodo,
  };
})();