package com.lp2.tapstyle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CuentaFinancieraDTO {
    private Long idFactura;
    private String numeroFactura;

    // Para Cuentas por Pagar
    private String nombreProveedor; // O "TapStyle"

    // Para Cuentas por Cobrar
    private String nombreCliente;

    private BigDecimal monto;
    private LocalDate fechaVencimiento;
    private String estado;
    private String tipo; // "SUSCRIPCION", "PROVEEDOR", "VENTA"
}
