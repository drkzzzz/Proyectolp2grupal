package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.model.*;
import com.lp2.tapstyle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final VarianteProductoRepository varianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final InventarioRepository inventarioRepository;

    public CarritoDTO obtenerOCrearCarrito(Integer idUsuario, Integer idEmpresa) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Empresa empresa = empresaRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        Carrito carrito = carritoRepository
                .findByUsuario_IdUsuarioAndEmpresa_IdEmpresaAndEstado(idUsuario, idEmpresa, "Activo")
                .orElseGet(() -> {
                    Carrito nuevoCarrito = Carrito.builder()
                            .usuario(usuario)
                            .empresa(empresa)
                            .estado("Activo")
                            .build();
                    return carritoRepository.save(nuevoCarrito);
                });

        return convertToDTO(carrito);
    }

    public CarritoDTO agregarAlCarrito(AgregarAlCarritoRequest request) {
        // Validar que la variante existe y tiene stock
        VarianteProducto variante = varianteRepository.findById(request.getIdVariante())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));

        // Obtener stock disponible
        Integer stockDisponible = inventarioRepository
                .findByVariante_IdVariante(request.getIdVariante())
                .stream()
                .mapToInt(Inventario::getCantidadStock)
                .sum();

        if (stockDisponible < request.getCantidad()) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + stockDisponible);
        }

        // Obtener o crear carrito
        Carrito carrito = carritoRepository
                .findByUsuario_IdUsuarioAndEmpresa_IdEmpresaAndEstado(
                        request.getIdUsuario(), request.getIdEmpresa(), "Activo")
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    Empresa empresa = empresaRepository.findById(request.getIdEmpresa())
                            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
                    
                    Carrito nuevoCarrito = Carrito.builder()
                            .usuario(usuario)
                            .empresa(empresa)
                            .estado("Activo")
                            .build();
                    return carritoRepository.save(nuevoCarrito);
                });

        // Buscar si ya existe el item
        ItemCarrito item = itemCarritoRepository
                .findByCarrito_IdCarritoAndVariante_IdVariante(carrito.getIdCarrito(), request.getIdVariante())
                .orElse(null);

        if (item != null) {
            // Actualizar cantidad
            Integer nuevaCantidad = item.getCantidad() + request.getCantidad();
            if (stockDisponible < nuevaCantidad) {
                throw new RuntimeException("Stock insuficiente para agregar más unidades");
            }
            item.setCantidad(nuevaCantidad);
        } else {
            // Crear nuevo item
            item = ItemCarrito.builder()
                    .carrito(carrito)
                    .variante(variante)
                    .cantidad(request.getCantidad())
                    .precioUnitario(variante.getPrecioVenta())
                    .build();
        }

        itemCarritoRepository.save(item);
        return convertToDTO(carritoRepository.findById(carrito.getIdCarrito()).orElseThrow());
    }

    public CarritoDTO actualizarCantidad(Long idItemCarrito, Integer nuevaCantidad) {
        ItemCarrito item = itemCarritoRepository.findById(idItemCarrito)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        if (nuevaCantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        // Validar stock
        Integer stockDisponible = inventarioRepository
                .findByVariante_IdVariante(item.getVariante().getIdVariante())
                .stream()
                .mapToInt(Inventario::getCantidadStock)
                .sum();

        if (stockDisponible < nuevaCantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + stockDisponible);
        }

        item.setCantidad(nuevaCantidad);
        itemCarritoRepository.save(item);

        return convertToDTO(item.getCarrito());
    }

    public CarritoDTO eliminarItem(Long idItemCarrito) {
        ItemCarrito item = itemCarritoRepository.findById(idItemCarrito)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        Carrito carrito = item.getCarrito();
        itemCarritoRepository.delete(item);

        return convertToDTO(carritoRepository.findById(carrito.getIdCarrito()).orElseThrow());
    }

    public void vaciarCarrito(Integer idCarrito) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        itemCarritoRepository.deleteAll(carrito.getItems());
    }

    private CarritoDTO convertToDTO(Carrito carrito) {
        List<ItemCarritoDTO> itemsDTO = carrito.getItems() != null ? 
                carrito.getItems().stream()
                        .map(this::convertItemToDTO)
                        .collect(Collectors.toList()) : List.of();

        BigDecimal subtotal = itemsDTO.stream()
                .map(ItemCarritoDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal igv = subtotal.multiply(new BigDecimal("0.18"));
        BigDecimal total = subtotal.add(igv);

        Integer cantidadTotal = itemsDTO.stream()
                .mapToInt(ItemCarritoDTO::getCantidad)
                .sum();

        return CarritoDTO.builder()
                .idCarrito(carrito.getIdCarrito())
                .idUsuario(carrito.getUsuario().getIdUsuario())
                .idEmpresa(carrito.getEmpresa().getIdEmpresa())
                .estado(carrito.getEstado())
                .items(itemsDTO)
                .subtotal(subtotal)
                .igv(igv)
                .total(total)
                .cantidadTotal(cantidadTotal)
                .build();
    }

    private ItemCarritoDTO convertItemToDTO(ItemCarrito item) {
        VarianteProducto variante = item.getVariante();
        Producto producto = variante.getProducto();

        Integer stockDisponible = inventarioRepository
                .findByVariante_IdVariante(variante.getIdVariante())
                .stream()
                .mapToInt(Inventario::getCantidadStock)
                .sum();

        return ItemCarritoDTO.builder()
                .idItemCarrito(item.getIdItemCarrito())
                .idCarrito(item.getCarrito().getIdCarrito())
                .idVariante(variante.getIdVariante())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .subtotal(item.getSubtotal())
                .fechaAgregado(item.getFechaAgregado())
                .nombreProducto(producto.getNombreProducto())
                .nombreVariante(variante.getColor() + " / " + variante.getTalla())
                .imagenUrl(null)
                .stockDisponible(stockDisponible)
                .build();
    }
}
