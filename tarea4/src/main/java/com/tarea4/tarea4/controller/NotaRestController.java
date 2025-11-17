package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.model.AvisoAdopcion;
import com.tarea4.tarea4.model.Nota;
import com.tarea4.tarea4.repository.AvisoAdopcionRepository;
import com.tarea4.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avisos")
public class NotaRestController {

    @Autowired
    private AvisoAdopcionRepository avisoRepo;

    @Autowired
    private NotaRepository notaRepo;

    @PostMapping("/{id}/notas")
    public Map<String, Object> agregarNota(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload
    ) {
        // 1) Obtener el valor crudo del JSON
        Object raw = payload.get("nota");
        if (raw == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nota es requerida");
        }

        // 2) Validar que sea numérico
        if (!(raw instanceof Number)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nota debe ser un número entero");
        }

        Number num = (Number) raw;
        double doubleValue = num.doubleValue();
        int intValue = num.intValue();

        // 3) Validar que sea ENTERO (sin decimales)
        if (doubleValue != intValue) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nota debe ser un número entero");
        }

        int valor = intValue;

        // 4) Validar rango 1–7
        if (valor < 1 || valor > 7) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nota debe estar entre 1 y 7");
        }

        // 5) Buscar aviso
        AvisoAdopcion aviso = avisoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Aviso no encontrado"
                ));

        // 6) Guardar nueva nota
        Nota n = new Nota();
        n.setAviso(aviso);
        n.setNota(valor);
        notaRepo.save(n);

        // 7) Recalcular promedio
        List<Nota> notas = notaRepo.findByAvisoId(id);
        double promedio = notas.stream()
                .mapToInt(Nota::getNota)
                .average()
                .orElse(0);

        Map<String, Object> resp = new HashMap<>();
        resp.put("promedio", promedio);
        return resp;
    }
}
