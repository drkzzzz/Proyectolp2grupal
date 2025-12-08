package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Empresa implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEmpresa;

    @NotBlank(message = "El nombre de la tienda es requerido")
    @Column(nullable = false, unique = true, length = 100)
    private String nombreTienda;

    @Column(unique = true, length = 20)
    private String rucEmpresa;

    @Column(length = 255)
    private String direccionLegal;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String emailContacto;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tasaComision = new BigDecimal("0.15");

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String modulosActivos = "DASHBOARD,CATALOGO,OPERACIONES,FINANZAS,ADMINISTRACION";

    @Column(name = "plan_id")
    private Long planId;
}
