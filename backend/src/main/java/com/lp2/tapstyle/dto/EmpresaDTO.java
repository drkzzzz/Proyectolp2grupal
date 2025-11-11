package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class EmpresaDTO {
    private Integer idEmpresa;
    private String nombreTienda;
    private String rucEmpresa;
    private String direccionLegal;
    private String telefono;
    private String emailContacto;
    private LocalDateTime fechaRegistro;
    private String estadoAprobacion;
    private BigDecimal tasaComision;
}
