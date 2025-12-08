package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.CategoriaProductoDTO;
import com.lp2.tapstyle.model.CategoriaProducto;
import com.lp2.tapstyle.repository.CategoriaProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaProductoService {

    private final CategoriaProductoRepository categoriaRepository;

    /**
     * Obtener todas las categorías
     */
    public List<CategoriaProductoDTO> obtenerTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener categoría por ID
     */
    public CategoriaProductoDTO obtenerPorId(Integer id) {
        return categoriaRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    /**
     * Crear nueva categoría
     */
    public CategoriaProductoDTO crear(CategoriaProductoDTO dto) {
        CategoriaProducto categoria = CategoriaProducto.builder()
                .nombreCategoria(dto.getNombreCategoria())
                .descripcion(dto.getDescripcion())
                .build();

        CategoriaProducto guardada = categoriaRepository.save(categoria);
        return mapToDTO(guardada);
    }

    /**
     * Actualizar categoría
     */
    public CategoriaProductoDTO actualizar(Integer id, CategoriaProductoDTO dto) {
        CategoriaProducto categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        if (dto.getNombreCategoria() != null) {
            categoria.setNombreCategoria(dto.getNombreCategoria());
        }
        if (dto.getDescripcion() != null) {
            categoria.setDescripcion(dto.getDescripcion());
        }

        CategoriaProducto actualizada = categoriaRepository.save(categoria);
        return mapToDTO(actualizada);
    }

    /**
     * Eliminar categoría
     */
    public void eliminar(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }

    /**
     * Mapear entidad a DTO
     */
    private CategoriaProductoDTO mapToDTO(CategoriaProducto categoria) {
        return CategoriaProductoDTO.builder()
                .idCategoria(categoria.getIdCategoria())
                .nombreCategoria(categoria.getNombreCategoria())
                .descripcion(categoria.getDescripcion())
                .build();
    }
}
