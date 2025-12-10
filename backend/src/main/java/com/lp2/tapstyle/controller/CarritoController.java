package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarritoController {

    private final CarritoService carritoService;

    @GetMapping
    public ResponseEntity<ApiResponse<CarritoDTO>> obtenerCarrito(
            @RequestParam Integer idUsuario,
            @RequestParam Integer idEmpresa) {
        try {
            CarritoDTO carrito = carritoService.obtenerOCrearCarrito(idUsuario, idEmpresa);
            return ResponseEntity.ok(ApiResponse.success(carrito, "Carrito obtenido"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @PostMapping("/agregar")
    public ResponseEntity<ApiResponse<CarritoDTO>> agregarAlCarrito(
            @RequestBody AgregarAlCarritoRequest request) {
        try {
            CarritoDTO carrito = carritoService.agregarAlCarrito(request);
            return ResponseEntity.ok(ApiResponse.success(carrito, "Producto agregado al carrito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @PutMapping("/item/{idItemCarrito}")
    public ResponseEntity<ApiResponse<CarritoDTO>> actualizarCantidad(
            @PathVariable Long idItemCarrito,
            @RequestParam Integer cantidad) {
        try {
            CarritoDTO carrito = carritoService.actualizarCantidad(idItemCarrito, cantidad);
            return ResponseEntity.ok(ApiResponse.success(carrito, "Cantidad actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @DeleteMapping("/item/{idItemCarrito}")
    public ResponseEntity<ApiResponse<CarritoDTO>> eliminarItem(@PathVariable Long idItemCarrito) {
        try {
            CarritoDTO carrito = carritoService.eliminarItem(idItemCarrito);
            return ResponseEntity.ok(ApiResponse.success(carrito, "Producto eliminado del carrito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @DeleteMapping("/{idCarrito}/vaciar")
    public ResponseEntity<ApiResponse<Void>> vaciarCarrito(@PathVariable Integer idCarrito) {
        try {
            carritoService.vaciarCarrito(idCarrito);
            return ResponseEntity.ok(ApiResponse.success(null, "Carrito vaciado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }
}
