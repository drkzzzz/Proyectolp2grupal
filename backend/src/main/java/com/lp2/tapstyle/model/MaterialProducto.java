package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "materialesproducto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MaterialProducto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMaterial;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @NotBlank(message = "El nombre del material es requerido")
    @Column(nullable = false, length = 100)
    private String nombreMaterial;
}
