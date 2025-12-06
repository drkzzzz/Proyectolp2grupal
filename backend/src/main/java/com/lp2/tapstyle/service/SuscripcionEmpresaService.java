package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.SuscripcionEmpresaDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.Plan;
import com.lp2.tapstyle.model.SuscripcionEmpresa;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.PlanRepository;
import com.lp2.tapstyle.repository.SuscripcionEmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuscripcionEmpresaService {

    @Autowired
    private SuscripcionEmpresaRepository suscripcionRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PlanRepository planRepository;

    public List<SuscripcionEmpresaDTO> listarTodas() {
        return suscripcionRepository.findAll().stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    public SuscripcionEmpresaDTO crearSuscripcion(Integer idEmpresa) {
        Empresa empresa = empresaRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        if (empresa.getPlanId() == null) {
            throw new RuntimeException("La empresa no tiene un plan asignado");
        }

        Plan plan = planRepository.findById(empresa.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        SuscripcionEmpresa suscripcion = new SuscripcionEmpresa();
        suscripcion.setEmpresa(empresa);
        suscripcion.setPlan(plan);
        suscripcion.setFechaInicio(LocalDate.now()); // Fecha de hoy
        suscripcion.setFechaVencimiento(LocalDate.now().plusMonths(1)); // Vence en 1 mes
        suscripcion.setPrecioAcordado(plan.getPrecioMensual());
        suscripcion.setEstado("Activa");

        SuscripcionEmpresa guardada = suscripcionRepository.save(suscripcion);
        return convertirADTO(guardada);
    }

    public SuscripcionEmpresaDTO actualizarEstado(Long id, String estado) {
        SuscripcionEmpresa suscripcion = suscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
        suscripcion.setEstado(estado);
        return convertirADTO(suscripcionRepository.save(suscripcion));
    }

    private SuscripcionEmpresaDTO convertirADTO(SuscripcionEmpresa entidad) {
        SuscripcionEmpresaDTO dto = new SuscripcionEmpresaDTO();
        dto.setIdSuscripcion(entidad.getIdSuscripcion());
        dto.setIdEmpresa(entidad.getEmpresa().getIdEmpresa());
        dto.setNombreEmpresa(entidad.getEmpresa().getNombreTienda());
        dto.setNombrePlan(entidad.getPlan().getNombrePlan());
        dto.setFechaInicio(entidad.getFechaInicio());
        dto.setFechaVencimiento(entidad.getFechaVencimiento());
        dto.setPrecioAcordado(entidad.getPrecioAcordado());
        dto.setEstado(entidad.getEstado());
        return dto;
    }

    public boolean verificarAcceso(Integer idEmpresa) {
        List<SuscripcionEmpresa> suscripciones = suscripcionRepository.findByEmpresaIdEmpresa(Long.valueOf(idEmpresa));
        // Si tiene alguna suscripción marcada como Inactiva o Suspendida, se deniega el
        // acceso
        boolean tieneBloqueo = suscripciones.stream()
                .anyMatch(s -> "Inactiva".equalsIgnoreCase(s.getEstado())
                        || "Suspendida".equalsIgnoreCase(s.getEstado()));
        return !tieneBloqueo;
    }
}
