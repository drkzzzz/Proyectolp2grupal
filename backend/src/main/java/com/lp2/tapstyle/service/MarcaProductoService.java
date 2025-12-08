package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.MarcaProductoDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.MarcaProducto;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.MarcaProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MarcaProductoService {

    private final MarcaProductoRepository marcaRepository;
    private final EmpresaRepository empresaRepository;

    /**
     * Obtener todas las marcas
     */
    public List<MarcaProductoDTO> obtenerTodas() {
        return marcaRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener marcas de una empresa específica
     */
    public List<MarcaProductoDTO> obtenerPorEmpresa(Integer empresaId) {
        return marcaRepository.findByEmpresa_IdEmpresa(empresaId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener marca por ID
     */
    public MarcaProductoDTO obtenerPorId(Integer id) {
        return marcaRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
    }

    /**
     * Crear nueva marca
     */
    public MarcaProductoDTO crear(MarcaProductoDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        MarcaProducto marca = MarcaProducto.builder()
                .empresa(empresa)
                .nombreMarca(dto.getNombreMarca())
                .build();

        MarcaProducto guardada = marcaRepository.save(marca);
        return mapToDTO(guardada);
    }

    /**
     * Actualizar marca
     */
    public MarcaProductoDTO actualizar(Integer id, MarcaProductoDTO dto) {
        MarcaProducto marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

        if (dto.getNombreMarca() != null) {
            marca.setNombreMarca(dto.getNombreMarca());
        }

        MarcaProducto actualizada = marcaRepository.save(marca);
        return mapToDTO(actualizada);
    }

    /**
     * Eliminar marca
     */
    public void eliminar(Integer id) {
        if (!marcaRepository.existsById(id)) {
            throw new RuntimeException("Marca no encontrada");
        }
        marcaRepository.deleteById(id);
    }

    /**
     * Mapear entidad a DTO
     */
    private MarcaProductoDTO mapToDTO(MarcaProducto marca) {
        return MarcaProductoDTO.builder()
                .idMarca(marca.getIdMarca())
                .idEmpresa(marca.getEmpresa().getIdEmpresa())
                .nombreMarca(marca.getNombreMarca())
                .build();
    }
}
