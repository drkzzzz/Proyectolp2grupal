package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ProductoDTO;
import com.lp2.tapstyle.model.*;
import com.lp2.tapstyle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> obtenerPorEmpresa(Integer empresaId) {
        return productoRepository.findByEmpresa_IdEmpresa(empresaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Integer id) {
        return productoRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    public ProductoDTO crear(ProductoDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        CategoriaProducto categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        UnidadMedida unidad = unidadMedidaRepository.findById(dto.getIdUnidadMedida())
                .orElseThrow(() -> new RuntimeException("Unidad de medida no encontrada"));

        Producto producto = Producto.builder()
                .empresa(empresa)
                .nombreProducto(dto.getNombreProducto())
                .descripcion(dto.getDescripcion())
                .categoria(categoria)
                .unidadMedida(unidad)
                .dimensiones(dto.getDimensiones())
                .pesoGramos(dto.getPesoGramos())
                .build();

        if (dto.getIdProveedor() != null) {
            Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElse(null);
            producto.setProveedor(proveedor);
        }

        if (dto.getIdMarca() != null) {
            MarcaProducto marca = marcaRepository.findById(dto.getIdMarca()).orElse(null);
            producto.setMarca(marca);
        }

        if (dto.getIdModelo() != null) {
            Modelo modelo = modeloRepository.findById(dto.getIdModelo()).orElse(null);
            producto.setModelo(modelo);
        }

        if (dto.getIdMaterial() != null) {
            MaterialProducto material = materialRepository.findById(dto.getIdMaterial()).orElse(null);
            producto.setMaterial(material);
        }

        Producto saved = productoRepository.save(producto);
        return convertToDTO(saved);
    }

    public ProductoDTO actualizar(Integer id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        producto.setNombreProducto(dto.getNombreProducto());
        producto.setDescripcion(dto.getDescripcion());
        producto.setDimensiones(dto.getDimensiones());
        producto.setPesoGramos(dto.getPesoGramos());

        Producto updated = productoRepository.save(producto);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    private ProductoDTO convertToDTO(Producto producto) {
        return ProductoDTO.builder()
                .idProducto(producto.getIdProducto())
                .idEmpresa(producto.getEmpresa().getIdEmpresa())
                .nombreProducto(producto.getNombreProducto())
                .descripcion(producto.getDescripcion())
                .idCategoria(producto.getCategoria().getIdCategoria())
                .idProveedor(producto.getProveedor() != null ? producto.getProveedor().getIdProveedor() : null)
                .idUnidadMedida(producto.getUnidadMedida().getIdUnidadMedida())
                .dimensiones(producto.getDimensiones())
                .pesoGramos(producto.getPesoGramos())
                .idMarca(producto.getMarca() != null ? producto.getMarca().getIdMarca() : null)
                .idModelo(producto.getModelo() != null ? producto.getModelo().getIdModelo() : null)
                .idMaterial(producto.getMaterial() != null ? producto.getMaterial().getIdMaterial() : null)
                .build();
    }
}
