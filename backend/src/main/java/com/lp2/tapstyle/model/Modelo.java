package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "Modelos")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Modelo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idModelo;

    @Column(nullable = false, length = 100)
    private String nombreModelo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_marca", nullable = false)
    private MarcaProducto marca;

    @Column(length = 255)
    private String imagenPrincipal;
}
