package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.UnidadMedidaDTO;
import com.lp2.tapstyle.model.UnidadMedida;
import com.lp2.tapstyle.repository.UnidadMedidaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UnidadMedidaService {

    private final UnidadMedidaRepository unidadRepository;

    /**
     * Obtener todas las unidades de medida
     */
    public List<UnidadMedidaDTO> obtenerTodas() {
        return unidadRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener unidades de medida de una empresa específica
     * Nota: Las unidades de medida son globales, este método retorna todas
     */
    public List<UnidadMedidaDTO> obtenerPorEmpresa(Integer empresaId) {
        // Las unidades de medida son globales para todas las empresas
        return obtenerTodas();
    }

    /**
     * Obtener unidad de medida por ID
     */
    public UnidadMedidaDTO obtenerPorId(Integer id) {
        return unidadRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Unidad de medida no encontrada"));
    }

    /**
     * Crear nueva unidad de medida
     */
    public UnidadMedidaDTO crear(UnidadMedidaDTO dto) {
        UnidadMedida unidad = UnidadMedida.builder()
                .nombreUnidad(dto.getNombreUnidad())
                .abreviatura(dto.getAbreviatura())
                .build();

        UnidadMedida guardada = unidadRepository.save(unidad);
        return mapToDTO(guardada);
    }

    /**
     * Actualizar unidad de medida
     */
    public UnidadMedidaDTO actualizar(Integer id, UnidadMedidaDTO dto) {
        UnidadMedida unidad = unidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidad de medida no encontrada"));

        if (dto.getNombreUnidad() != null) {
            unidad.setNombreUnidad(dto.getNombreUnidad());
        }
        if (dto.getAbreviatura() != null) {
            unidad.setAbreviatura(dto.getAbreviatura());
        }

        UnidadMedida actualizada = unidadRepository.save(unidad);
        return mapToDTO(actualizada);
    }

    /**
     * Eliminar unidad de medida
     */
    public void eliminar(Integer id) {
        if (!unidadRepository.existsById(id)) {
            throw new RuntimeException("Unidad de medida no encontrada");
        }
        unidadRepository.deleteById(id);
    }

    /**
     * Mapear entidad a DTO
     */
    private UnidadMedidaDTO mapToDTO(UnidadMedida unidad) {
        return UnidadMedidaDTO.builder()
                .idUnidadMedida(unidad.getIdUnidadMedida())
                .nombreUnidad(unidad.getNombreUnidad())
                .abreviatura(unidad.getAbreviatura())
                .build();
    }
}
