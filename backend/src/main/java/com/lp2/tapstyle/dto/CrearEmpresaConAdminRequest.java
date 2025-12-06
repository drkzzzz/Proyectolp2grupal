package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CrearEmpresaConAdminRequest {
    private EmpresaDTO empresa;
    private DatosAdminDTO administrador;
}
