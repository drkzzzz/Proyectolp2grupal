package com.lp2.tapstyle.dto;

import com.lp2.tapstyle.model.Permiso;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Integer idUsuario;
    private String username;
    private String nombres;
    private String apellidos;
    private String email;
    private Integer idRol;
    private String nombreRol;
    private Integer idEmpresa;
    private String nombreEmpresa;
    private Set<String> permisos; // Lista de nombres de permisos
    private String token; // Opcional: para JWT en el futuro
}
