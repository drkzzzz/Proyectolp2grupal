package com.lp2.tapstyle.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SuscripcionEmpresaDTO {
    private Long idSuscripcion;
    private Integer idEmpresa;
    private String nombreEmpresa;
    private String nombrePlan;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private BigDecimal precioAcordado;
    private String estado;
}
