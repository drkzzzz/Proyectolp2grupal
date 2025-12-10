package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.ProductoDTO;
import com.lp2.tapstyle.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    /**
     * GET /api/productos/empresa/{empresaId}
     * Obtener todos los productos de una empresa CON STOCK REAL
     */
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerPorEmpresa(@PathVariable Integer empresaId) {
        try {
            System.out.println("📦 Obteniendo productos para empresa: " + empresaId);
            List<ProductoDTO> productos = productoService.obtenerPorEmpresaConStock(empresaId);
            System.out.println("✅ Productos encontrados: " + productos.size());
            productos.forEach(p -> System.out
                    .println("  - " + p.getNombreProducto() + " ($" + p.getPrecio() + ") Stock: " + p.getStock()));
            return ResponseEntity.ok(ApiResponse.success(productos, "Productos cargados exitosamente"));
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ProductoError", "Error al obtener productos: " + e.getMessage()));
        }
    }

    /**
     * GET /api/productos/{id}
     * Obtener un producto específico
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            ProductoDTO producto = productoService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(producto, "Producto encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Producto no encontrado"));
        }
    }

    /**
     * GET /api/productos
     * Obtener todos los productos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerTodos() {
        try {
            List<ProductoDTO> productos = productoService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success(productos, "Productos cargados"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ProductoError", "Error: " + e.getMessage()));
        }
    }

    /**
     * POST /api/productos
     * Crear nuevo producto
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductoDTO>> crear(@RequestBody ProductoDTO dto) {
        try {
            ProductoDTO nuevoProducto = productoService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nuevoProducto, "Producto creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error al crear producto: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/productos/{id}
     * Actualizar producto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody ProductoDTO dto) {
        try {
            ProductoDTO actualizado = productoService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizado, "Producto actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error al actualizar: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/productos/{id}
     * Eliminar producto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Producto eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error al eliminar: " + e.getMessage()));
        }
    }
}
