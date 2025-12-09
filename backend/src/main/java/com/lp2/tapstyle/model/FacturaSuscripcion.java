package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "facturassuscripcion")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacturaSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura_suscripcion")
    private Long idFacturaSuscripcion;

    @Column(name = "id_empresa", nullable = false)
    private Integer idEmpresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_suscripcion", nullable = false)
    private SuscripcionEmpresa suscripcion;

    @Column(name = "numero_factura", nullable = false, length = 20)
    private String numeroFactura;

    @Column(name = "periodo_inicio", nullable = false)
    private LocalDate periodoInicio;

    @Column(name = "periodo_fin", nullable = false)
    private LocalDate periodoFin;

    @Column(name = "monto_suscripcion", nullable = false)
    private BigDecimal montoSuscripcion;

    @Column(name = "fecha_emision", nullable = false)
    @Builder.Default
    private LocalDateTime fechaEmision = LocalDateTime.now();

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Column(name = "estado", nullable = false, length = 20)
    @Builder.Default
    private String estado = "Pendiente"; // Pendiente, Pagado, Vencido

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;
}
