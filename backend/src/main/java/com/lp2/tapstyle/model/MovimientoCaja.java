package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientoscaja")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MovimientoCaja implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento_caja")
    private Long idMovimientoCaja;

    @Column(name = "id_caja", nullable = false)
    private Integer idCaja;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento;

    @Column(name = "tipo_movimiento", nullable = false)
    private String tipoMovimiento;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "id_comprobante")
    private Long idComprobante;
}
