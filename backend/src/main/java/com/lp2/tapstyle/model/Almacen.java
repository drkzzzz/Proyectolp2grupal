package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "Almacenes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Almacen implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAlmacen;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 100)
    private String nombreAlmacen;

    @Column(length = 255)
    private String ubicacion;
}
