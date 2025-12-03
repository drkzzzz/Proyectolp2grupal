package com.lp2.tapstyle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tipo; // "cliente" o "admin"
    private UsuarioDTO usuario;
    private EmpresaDTO empresa; // Solo para admin (puede ser null para clientes)
    private String mensaje;
}
