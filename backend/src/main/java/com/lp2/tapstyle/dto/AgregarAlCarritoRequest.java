package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AgregarAlCarritoRequest {
    private Integer idUsuario;
    private Integer idEmpresa;
    private Integer idVariante;
    private Integer cantidad;
}
