package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ProductoDTO;
import com.lp2.tapstyle.model.*;
import com.lp2.tapstyle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final EmpresaRepository empresaRepository;
    private final CategoriaProductoRepository categoriaRepository;
    private final ProveedorRepository proveedorRepository;
    private final UnidadMedidaRepository unidadMedidaRepository;
    private final MarcaProductoRepository marcaRepository;
    private final ModeloRepository modeloRepository;
    private final MaterialProductoRepository materialRepository;
    private final InventarioRepository inventarioRepository;
    private final VarianteProductoRepository varianteRepository;

    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> obtenerPorEmpresa(Integer empresaId) {
        try {
            return productoRepository.findByEmpresa_IdEmpresa(empresaId).stream()
                    .map(this::convertToDTO)
                    .filter(dto -> dto.getNombreProducto() != null) // Filtrar DTOs válidos
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("❌ Error en obtenerPorEmpresa: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<ProductoDTO> obtenerPorEmpresaConStock(Integer empresaId) {
        List<Producto> productos = productoRepository.findByEmpresa_IdEmpresa(empresaId);
        return productos.stream()
                .map(producto -> {
                    ProductoDTO dto = convertToDTO(producto);
                    // Calcular stock total: suma de inventario de todas las variantes
                    try {
                        Integer stockTotal = varianteRepository.findByProducto_IdProducto(producto.getIdProducto())
                                .stream()
                                .mapToInt(variante -> {
                                    List<Inventario> invs = inventarioRepository
                                            .findByVariante_IdVariante(variante.getIdVariante());
                                    return invs.stream().mapToInt(Inventario::getCantidadStock).sum();
                                })
                                .sum();
                        dto.setStock(stockTotal > 0 ? stockTotal : 0);
                    } catch (Exception e) {
                        dto.setStock(0);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Integer id) {
        return productoRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    public ProductoDTO crear(ProductoDTO dto) {
        // Validación de datos requeridos
        if (dto.getIdEmpresa() == null) {
            throw new RuntimeException("El ID de empresa es requerido");
        }
        if (dto.getIdCategoria() == null) {
            throw new RuntimeException("El ID de categoría es requerido");
        }
        if (dto.getIdUnidadMedida() == null) {
            throw new RuntimeException("El ID de unidad de medida es requerido");
        }

        // Buscar empresa
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa con ID " + dto.getIdEmpresa() + " no encontrada"));

        // Buscar categoría
        CategoriaProducto categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría con ID " + dto.getIdCategoria() + " no encontrada"));

        // Buscar unidad de medida
        UnidadMedida unidad = unidadMedidaRepository.findById(dto.getIdUnidadMedida())
                .orElseThrow(() -> new RuntimeException(
                        "Unidad de medida con ID " + dto.getIdUnidadMedida() + " no encontrada"));

        Producto producto = Producto.builder()
                .empresa(empresa)
                .nombreProducto(dto.getNombreProducto())
                .descripcion(dto.getDescripcion())
                .categoria(categoria)
                .unidadMedida(unidad)
                .dimensiones(dto.getDimensiones())
                .pesoGramos(dto.getPesoGramos())
                .precio(dto.getPrecio())
                .build();

        // Proveedor (opcional)
        if (dto.getIdProveedor() != null && dto.getIdProveedor() > 0) {
            Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor())
                    .orElseThrow(
                            () -> new RuntimeException("Proveedor con ID " + dto.getIdProveedor() + " no encontrado"));
            producto.setProveedor(proveedor);
        }

        // Marca (opcional)
        if (dto.getIdMarca() != null && dto.getIdMarca() > 0) {
            MarcaProducto marca = marcaRepository.findById(dto.getIdMarca())
                    .orElseThrow(() -> new RuntimeException("Marca con ID " + dto.getIdMarca() + " no encontrada"));
            producto.setMarca(marca);
        }

        // Modelo (opcional)
        if (dto.getIdModelo() != null && dto.getIdModelo() > 0) {
            Modelo modelo = modeloRepository.findById(dto.getIdModelo())
                    .orElseThrow(() -> new RuntimeException("Modelo con ID " + dto.getIdModelo() + " no encontrado"));
            producto.setModelo(modelo);
        }

        // Material (opcional)
        if (dto.getIdMaterial() != null && dto.getIdMaterial() > 0) {
            MaterialProducto material = materialRepository.findById(dto.getIdMaterial())
                    .orElseThrow(
                            () -> new RuntimeException("Material con ID " + dto.getIdMaterial() + " no encontrado"));
            producto.setMaterial(material);
        }

        try {
            Producto saved = productoRepository.save(producto);
            return convertToDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el producto: " + e.getMessage());
        }
    }

    public ProductoDTO actualizar(Integer id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        producto.setNombreProducto(dto.getNombreProducto());
        producto.setDescripcion(dto.getDescripcion());
        producto.setDimensiones(dto.getDimensiones());
        producto.setPesoGramos(dto.getPesoGramos());
        producto.setPrecio(dto.getPrecio());

        Producto updated = productoRepository.save(producto);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    private ProductoDTO convertToDTO(Producto producto) {
        try {
            return ProductoDTO.builder()
                    .idProducto(producto.getIdProducto())
                    .idEmpresa(producto.getEmpresa() != null ? producto.getEmpresa().getIdEmpresa() : null)
                    .nombreProducto(producto.getNombreProducto())
                    .descripcion(producto.getDescripcion())
                    .idCategoria(producto.getCategoria() != null ? producto.getCategoria().getIdCategoria() : null)
                    .nombreCategoria(producto.getCategoria() != null ? producto.getCategoria().getNombreCategoria()
                            : "Sin Categoría")
                    .idProveedor(producto.getProveedor() != null ? producto.getProveedor().getIdProveedor() : null)
                    .nombreProveedor(
                            producto.getProveedor() != null ? producto.getProveedor().getNombreComercial() : null)
                    .idUnidadMedida(
                            producto.getUnidadMedida() != null ? producto.getUnidadMedida().getIdUnidadMedida() : null)
                    .nombreUnidad(producto.getUnidadMedida() != null ? producto.getUnidadMedida().getNombreUnidad()
                            : "Sin Unidad")
                    .dimensiones(producto.getDimensiones())
                    .pesoGramos(producto.getPesoGramos())
                    .precio(producto.getPrecio())
                    .idMarca(producto.getMarca() != null ? producto.getMarca().getIdMarca() : null)
                    .nombreMarca(producto.getMarca() != null ? producto.getMarca().getNombreMarca() : null)
                    .idModelo(producto.getModelo() != null ? producto.getModelo().getIdModelo() : null)
                    .nombreModelo(producto.getModelo() != null ? producto.getModelo().getNombreModelo() : null)
                    .idMaterial(producto.getMaterial() != null ? producto.getMaterial().getIdMaterial() : null)
                    .nombreMaterial(producto.getMaterial() != null ? producto.getMaterial().getNombreMaterial() : null)
                    .build();
        } catch (Exception e) {
            System.out.println("⚠️ Error al convertir producto " + producto.getIdProducto() + ": " + e.getMessage());
            // Retornar DTO con datos básicos si hay error
            return ProductoDTO.builder()
                    .idProducto(producto.getIdProducto())
                    .nombreProducto(producto.getNombreProducto())
                    .descripcion(producto.getDescripcion())
                    .precio(producto.getPrecio())
                    .build();
        }
    }
}
