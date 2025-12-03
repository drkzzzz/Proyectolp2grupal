package com.lp2.tapstyle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAdminRequest {

    @NotBlank(message = "El username o email es requerido")
    private String username; // Puede ser username o email

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
