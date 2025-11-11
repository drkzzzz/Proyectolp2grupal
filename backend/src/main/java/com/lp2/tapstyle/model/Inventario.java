package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "Inventario")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Inventario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInventario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_variante", nullable = false)
    private VarianteProducto variante;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_almacen", nullable = false)
    private Almacen almacen;

    @Column(nullable = false)
    @Builder.Default
    private Integer cantidadStock = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockMinimo = 5;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime fechaUltimaActualizacion = LocalDateTime.now();
}
