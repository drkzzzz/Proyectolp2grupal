package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.InventarioDTO;
import com.lp2.tapstyle.model.Almacen;
import com.lp2.tapstyle.model.Inventario;
import com.lp2.tapstyle.model.Producto;
import com.lp2.tapstyle.model.VarianteProducto;
import com.lp2.tapstyle.repository.AlmacenRepository;
import com.lp2.tapstyle.repository.InventarioRepository;
import com.lp2.tapstyle.repository.ProductoRepository;
import com.lp2.tapstyle.repository.VarianteProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    private final ProductoRepository productoRepository;

    public List<InventarioDTO> obtenerTodos() {
        return inventarioRepository.findAll().stream()
                .filter(inventario -> inventario.getVariante() != null &&
                        inventario.getVariante().getProducto() != null)
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
                .filter(inventario -> inventario.getVariante() != null &&
                        inventario.getVariante().getProducto() != null)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventarioDTO> obtenerPorEmpresa(Integer empresaId) {
        try {
            // Obtener todos los inventarios de la empresa sin lazy loading inicial
            List<Inventario> inventarios = inventarioRepository.findByAlmacen_Empresa_IdEmpresa(empresaId);

            // Filtrar y procesar con manejo de excepciones
            return inventarios.stream()
                    .filter(inventario -> {
                        try {
                            // Validar que variante y producto existan sin lazy loading
                            if (inventario.getVariante() == null) {
                                System.err.println(
                                        "⚠️ Inventario " + inventario.getIdInventario() + " sin variante válida");
                                return false;
                            }
                            if (inventario.getVariante().getProducto() == null) {
                                System.err.println("⚠️ Variante " + inventario.getVariante().getIdVariante()
                                        + " sin producto válido");
                                return false;
                            }
                            return true;
                        } catch (Exception e) {
                            System.err.println("⚠️ Error validando inventario " + inventario.getIdInventario() + ": "
                                    + e.getMessage());
                            return false;
                        }
                    })
                    .map(inventario -> {
                        try {
                            return convertToDTO(inventario);
                        } catch (Exception e) {
                            System.err.println("⚠️ Error convirtiendo inventario: " + e.getMessage());
                            return null;
                        }
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("❌ Error en obtenerPorEmpresa: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public List<InventarioDTO> obtenerProductosBajoStock() {
        return inventarioRepository.findByCantidadStockLessThan(100).stream()
                .filter(inventario -> inventario.getVariante() != null &&
                        inventario.getVariante().getProducto() != null)
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

    public void ajustarStockPorProducto(Integer idProducto, Integer cantidad, String tipo) {
        // Busca los inventarios del producto
        List<Inventario> inventarios = inventarioRepository.findByProductoId(idProducto);

        if (inventarios.isEmpty()) {
            // Crear automáticamente inventario si no existe
            Producto producto = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + idProducto));

            // Obtener la primera variante del producto
            VarianteProducto variante = varianteRepository.findByProducto_IdProducto(idProducto)
                    .stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No hay variantes para el producto: " + idProducto));

            // Obtener el primer almacén disponible
            Almacen almacen = almacenRepository.findAll()
                    .stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No hay almacenes disponibles"));

            // Crear nuevo inventario
            Inventario nuevoInventario = new Inventario();
            nuevoInventario.setVariante(variante);
            nuevoInventario.setAlmacen(almacen);
            nuevoInventario.setStockMinimo(5);
            nuevoInventario.setCantidadStock(0);
            nuevoInventario.setFechaUltimaActualizacion(LocalDateTime.now());

            inventarios = List.of(inventarioRepository.save(nuevoInventario));
        }

        Inventario inventario = inventarios.get(0);

        if ("entrada".equalsIgnoreCase(tipo)) {
            inventario.setCantidadStock(inventario.getCantidadStock() + cantidad);
        } else if ("salida".equalsIgnoreCase(tipo)) {
            if (inventario.getCantidadStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente para el producto");
            }
            inventario.setCantidadStock(inventario.getCantidadStock() - cantidad);
        }

        inventario.setFechaUltimaActualizacion(LocalDateTime.now());
        inventarioRepository.save(inventario);
    }

    public int limpiarInventarioHuerfano() {
        System.out.println("🧹 Iniciando limpieza de inventario huérfano...");
        try {
            int eliminados = inventarioRepository.deleteHuerfanoInventories();
            System.out.println("✅ Se eliminaron " + eliminados + " registros de inventario huérfano");
            return eliminados;
        } catch (Exception e) {
            System.err.println("❌ Error al limpiar inventario huérfano: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al limpiar inventario huérfano: " + e.getMessage());
        }
    }

    private InventarioDTO convertToDTO(Inventario inventario) {
        if (inventario == null || inventario.getVariante() == null) {
            return null;
        }

        VarianteProducto variante = inventario.getVariante();
        Producto producto = variante.getProducto();

        if (producto == null) {
            return null;
        }

        return InventarioDTO.builder()
                .idInventario(inventario.getIdInventario())
                .idProducto(producto.getIdProducto())
                .nombreProducto(producto.getNombreProducto())
                .idVariante(variante.getIdVariante())
                .idAlmacen(inventario.getAlmacen().getIdAlmacen())
                .nombreAlmacen(inventario.getAlmacen().getNombreAlmacen())
                .cantidadStock(inventario.getCantidadStock())
                .stockMinimo(inventario.getStockMinimo())
                .precioUnitario(producto.getPrecio() != null ? producto.getPrecio() : BigDecimal.ZERO)
                .fechaUltimaActualizacion(inventario.getFechaUltimaActualizacion() != null
                        ? inventario.getFechaUltimaActualizacion().toString()
                        : null)
                .build();
    }
}
