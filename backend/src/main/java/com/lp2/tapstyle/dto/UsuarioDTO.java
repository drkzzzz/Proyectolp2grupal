package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioDTO {
    private Integer idUsuario;
    private Integer idEmpresa;
    private Integer idRol;
    private String nombres;
    private String apellidos;
    private String numeroDocumento;
    private String celular;
    private String direccion;
    private String username;
    private String email;
    private String password;
    private Boolean estado;
}
