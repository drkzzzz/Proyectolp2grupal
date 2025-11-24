package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.InventarioDTO;
import com.lp2.tapstyle.model.Almacen;
import com.lp2.tapstyle.model.Inventario;
import com.lp2.tapstyle.model.VarianteProducto;
import com.lp2.tapstyle.repository.AlmacenRepository;
import com.lp2.tapstyle.repository.InventarioRepository;
import com.lp2.tapstyle.repository.VarianteProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final VarianteProductoRepository varianteRepository;
    private final AlmacenRepository almacenRepository;

    public List<InventarioDTO> obtenerTodos() {
        return inventarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InventarioDTO obtenerPorId(Integer id) {
        return inventarioRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con id: " + id));
    }

    public List<InventarioDTO> obtenerPorAlmacen(Integer almacenId) {
        return inventarioRepository.findByAlmacen_IdAlmacen(almacenId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventarioDTO> obtenerProductosBajoStock() {
        return inventarioRepository.findByCantidadStockLessThan(100).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InventarioDTO crear(InventarioDTO dto) {
        VarianteProducto variante = varianteRepository.findById(dto.getIdVariante())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada con id: " + dto.getIdVariante()));

        Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                .orElseThrow(() -> new RuntimeException("Almacén no encontrado con id: " + dto.getIdAlmacen()));

        Inventario inventario = Inventario.builder()
                .variante(variante)
                .almacen(almacen)
                .cantidadStock(dto.getCantidadStock())
                .stockMinimo(dto.getStockMinimo())
                .build();

        Inventario saved = inventarioRepository.save(inventario);
        return convertToDTO(saved);
    }

    public InventarioDTO actualizar(Integer id, InventarioDTO dto) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con id: " + id));

        inventario.setCantidadStock(dto.getCantidadStock());
        inventario.setStockMinimo(dto.getStockMinimo());
        inventario.setFechaUltimaActualizacion(LocalDateTime.now());

        Inventario updated = inventarioRepository.save(inventario);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        inventarioRepository.deleteById(id);
    }

    public void ajustarStock(Integer inventarioId, Integer cantidad, String tipo) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        if ("entrada".equalsIgnoreCase(tipo)) {
            inventario.setCantidadStock(inventario.getCantidadStock() + cantidad);
        } else if ("salida".equalsIgnoreCase(tipo)) {
            if (inventario.getCantidadStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente");
            }
            inventario.setCantidadStock(inventario.getCantidadStock() - cantidad);
        }

        inventario.setFechaUltimaActualizacion(LocalDateTime.now());
        inventarioRepository.save(inventario);
    }

    private InventarioDTO convertToDTO(Inventario inventario) {
        return InventarioDTO.builder()
                .idInventario(inventario.getIdInventario())
                .idVariante(inventario.getVariante().getIdVariante())
                .idAlmacen(inventario.getAlmacen().getIdAlmacen())
                .cantidadStock(inventario.getCantidadStock())
                .stockMinimo(inventario.getStockMinimo())
                .fechaUltimaActualizacion(inventario.getFechaUltimaActualizacion().toString())
                .build();
    }
}
