package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.service.UsuarioService;
import com.lp2.tapstyle.service.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final EmpresaService empresaService;
    private final PasswordEncoder passwordEncoder;

    // TEMPORAL: Generar hash BCrypt
    @GetMapping("/hash/{password}")
    public String generarHash(@PathVariable String password) {
        String hash = passwordEncoder.encode(password);
        return "Password: " + password + "\nHash BCrypt:\n" + hash +
                "\n\nINSERT SQL:\nINSERT INTO usuarios (id_usuario, id_empresa, id_rol, nombres, apellidos, username, email, contraseña_hash, estado, fecha_creacion) "
                +
                "VALUES (90, 5, 1, 'Santiago', 'Ponce', 'Santi', 'santi@tapstyle.com', '" + hash + "', 1, NOW());";
    }

    // LOGIN SIMPLIFICADO - USA ESTE
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginAdminRequest request) {
        try {
            Usuario usuario = usuarioService.obtenerEntidadPorUsernameOEmail(request.getUsername());

            // Validar contraseña con BCrypt
            if (!passwordEncoder.matches(request.getPassword(), usuario.getContraseñaHash())) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("AuthenticationFailed", "Usuario o contraseña incorrectos"));
            }

            // Convertir a DTO
            UsuarioDTO usuarioDTO = usuarioService.obtenerPorId(usuario.getIdUsuario());

            // Obtener empresa si tiene
            EmpresaDTO empresaDTO = null;
            if (usuario.getEmpresa() != null) {
                empresaDTO = empresaService.obtenerPorId(usuario.getEmpresa().getIdEmpresa());
            }

            // Determinar tipo según rol
            int rolId = usuario.getRol().getIdRol();
            String tipo = "usuario";
            if (rolId == 1)
                tipo = "superadmin";
            else if (rolId == 2)
                tipo = "admin";
            else if (rolId == 5)
                tipo = "cliente";

            // Crear respuesta
            AuthResponse authResponse = AuthResponse.builder()
                    .token("jwt-" + usuario.getIdUsuario())
                    .tipo(tipo)
                    .usuario(usuarioDTO)
                    .empresa(empresaDTO)
                    .mensaje("Bienvenido " + usuario.getNombres())
                    .build();

            return ResponseEntity.ok(ApiResponse.success(authResponse, "Login exitoso"));

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
