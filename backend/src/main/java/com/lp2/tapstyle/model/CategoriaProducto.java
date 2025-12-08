package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "categoriasproducto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategoriaProducto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;

    @NotBlank(message = "El nombre de la categoría es requerido")
    @Column(nullable = false, unique = true, length = 50)
    private String nombreCategoria;

    @Column(length = 255)
    private String descripcion;
}
