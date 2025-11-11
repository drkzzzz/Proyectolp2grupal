package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "MaterialesProducto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MaterialProducto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMaterial;

    @NotBlank(message = "El nombre del material es requerido")
    @Column(nullable = false, unique = true, length = 100)
    private String nombreMaterial;
}
