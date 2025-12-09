package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagosempresaatapstyle")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagosEmpresaATapStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;

    @Column(name = "id_empresa", nullable = false)
    private Integer idEmpresa;

    @Column(name = "tipo_pago", nullable = false, length = 20)
    private String tipoPago; // SUSCRIPCION, COMISION

    @Column(name = "id_factura_suscripcion")
    private Long idFacturaSuscripcion;

    @Column(name = "id_factura_comision")
    private Long idFacturaComision;

    @Column(name = "monto_pagado", nullable = false)
    private BigDecimal montoPagado;

    @Column(name = "fecha_pago", nullable = false)
    @Builder.Default
    private LocalDateTime fechaPago = LocalDateTime.now();

    @Column(name = "metodo_pago", nullable = false, length = 50)
    private String metodoPago;

    @Column(name = "referencia_pago", length = 100)
    private String referenciaPago;

    @Column(name = "comprobante_pago")
    private String comprobantePago;
}
