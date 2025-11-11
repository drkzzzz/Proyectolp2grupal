package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.LoginDTO;
import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.UsuarioDTO;
import com.lp2.tapstyle.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UsuarioDTO>> login(@RequestBody LoginDTO loginDTO) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerPorUsername(loginDTO.getUsername());
            // En una implementación real, verificar la contraseña
            return ResponseEntity.ok(ApiResponse.success(usuario, "Login exitoso"));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("AuthenticationFailed", "Usuario o contraseña incorrectos"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UsuarioDTO>> register(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO newUsuario = usuarioService.crear(usuarioDTO);
            return ResponseEntity.ok(ApiResponse.success(newUsuario, "Usuario creado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("RegistrationFailed", e.getMessage()));
        }
    }

    @GetMapping("/me/{username}")
    public ResponseEntity<ApiResponse<UsuarioDTO>> getCurrentUser(@PathVariable String username) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerPorUsername(username);
            return ResponseEntity.ok(ApiResponse.success(usuario, "Datos de usuario obtenidos"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
