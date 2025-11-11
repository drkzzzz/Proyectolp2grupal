package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "Cajas")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Caja implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCaja;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 50)
    private String nombreCaja;

    @Column(length = 255)
    private String ubicacion;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Cerrada";
}
