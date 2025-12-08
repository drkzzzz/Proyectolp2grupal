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
     * Obtener unidad por ID
     */
    public UnidadMedidaDTO obtenerPorId(Integer id) {
        return unidadRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Unidad de medida no encontrada"));
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
