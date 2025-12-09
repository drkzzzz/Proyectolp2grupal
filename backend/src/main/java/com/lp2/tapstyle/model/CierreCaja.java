package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cierrescaja")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CierreCaja implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCierre;

    @OneToOne(optional = false)
    @JoinColumn(name = "id_apertura", nullable = false)
    private AperturaCaja apertura;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_caja", nullable = false)
    private Caja caja;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "fecha_cierre", nullable = false)
    private LocalDate fechaCierre;

    @Column(name = "hora_cierre", nullable = false)
    private LocalTime horaCierre;

    @Column(name = "monto_final", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoFinal;

    @Column(name = "monto_esperado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoEsperado;

    @Column(name = "diferencia", nullable = false, precision = 10, scale = 2)
    private BigDecimal diferencia;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}
