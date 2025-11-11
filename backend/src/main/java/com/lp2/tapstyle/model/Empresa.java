package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Empresas")
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
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String estadoAprobacion = "Pendiente";

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal tasaComision = new BigDecimal("0.15");
}
