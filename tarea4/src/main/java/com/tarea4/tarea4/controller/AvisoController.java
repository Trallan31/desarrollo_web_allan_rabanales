package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.model.AvisoAdopcion;
import com.tarea4.tarea4.model.Nota;
import com.tarea4.tarea4.repository.AvisoAdopcionRepository;
import com.tarea4.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AvisoController {

    @Autowired
    private AvisoAdopcionRepository avisoRepo;

    @Autowired
    private NotaRepository notaRepo;

    @GetMapping("/avisos")
    public String listadoAvisos(Model model) {
        // Traer todos los avisos desde la BD
        List<AvisoAdopcion> avisos = avisoRepo.findAll();

        // Para cada aviso, calculamos el promedio de sus notas
        for (AvisoAdopcion aviso : avisos) {
            List<Nota> notas = notaRepo.findByAvisoId(aviso.getId());

            if (notas == null || notas.isEmpty()) {
                aviso.setPromedioNota(null);  // así la vista muestra "-"
            } else {
                double promedio = notas.stream()
                        .mapToInt(Nota::getNota)
                        .average()
                        .orElse(0);

                aviso.setPromedioNota(promedio);
            }
        }

        model.addAttribute("avisos", avisos);
        return "avisos"; // templates/avisos.html
    }
}
