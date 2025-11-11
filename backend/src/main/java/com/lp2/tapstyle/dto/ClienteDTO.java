package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ClienteDTO {
    private Integer idCliente;
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String numeroDocumento;
    private String direccion;
    private String telefono;
    private String email;
    private Boolean estado;
}
