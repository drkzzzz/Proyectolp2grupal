package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.MaterialProductoDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.MaterialProducto;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.MaterialProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialProductoService {

    private final MaterialProductoRepository materialRepository;
    private final EmpresaRepository empresaRepository;

    /**
     * Obtener todos los materiales
     */
    public List<MaterialProductoDTO> obtenerTodos() {
        return materialRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener materiales de una empresa específica
     */
    public List<MaterialProductoDTO> obtenerPorEmpresa(Integer empresaId) {
        return materialRepository.findByEmpresa_IdEmpresa(empresaId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener material por ID
     */
    public MaterialProductoDTO obtenerPorId(Integer id) {
        return materialRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));
    }

    /**
     * Crear nuevo material
     */
    public MaterialProductoDTO crear(MaterialProductoDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        MaterialProducto material = MaterialProducto.builder()
                .empresa(empresa)
                .nombreMaterial(dto.getNombreMaterial())
                .build();

        MaterialProducto guardado = materialRepository.save(material);
        return mapToDTO(guardado);
    }

    /**
     * Actualizar material
     */
    public MaterialProductoDTO actualizar(Integer id, MaterialProductoDTO dto) {
        MaterialProducto material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        if (dto.getNombreMaterial() != null) {
            material.setNombreMaterial(dto.getNombreMaterial());
        }

        MaterialProducto actualizado = materialRepository.save(material);
        return mapToDTO(actualizado);
    }

    /**
     * Eliminar material
     */
    public void eliminar(Integer id) {
        if (!materialRepository.existsById(id)) {
            throw new RuntimeException("Material no encontrado");
        }
        materialRepository.deleteById(id);
    }

    /**
     * Mapear entidad a DTO
     */
    private MaterialProductoDTO mapToDTO(MaterialProducto material) {
        return MaterialProductoDTO.builder()
                .idMaterial(material.getIdMaterial())
                .idEmpresa(material.getEmpresa().getIdEmpresa())
                .nombreMaterial(material.getNombreMaterial())
                .build();
    }
}
