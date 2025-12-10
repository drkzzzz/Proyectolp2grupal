package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "permisos")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Permiso implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPermiso;

    @NotBlank(message = "El nombre del permiso es requerido")
    @Column(nullable = false, unique = true, length = 100)
    private String nombrePermiso;

    @Column(length = 255)
    private String descripcion;

    // Relación Many-to-Many con Roles (inversa)
    @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Builder.Default
    private java.util.Set<Rol> roles = new java.util.HashSet<>();
}
