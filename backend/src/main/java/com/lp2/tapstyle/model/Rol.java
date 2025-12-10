package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Rol implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRol;

    @NotBlank(message = "El nombre del rol es requerido")
    @Column(nullable = false, unique = true, length = 50)
    private String nombreRol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;

    @Column(length = 255)
    private String descripcion;

    // Relación Many-to-Many con Permisos
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rol_permisos", joinColumns = @JoinColumn(name = "id_rol"), inverseJoinColumns = @JoinColumn(name = "id_permiso"))
    @Builder.Default
    private java.util.Set<Permiso> permisos = new java.util.HashSet<>();

    // Relación One-to-Many con Usuarios (inversa)
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Usuario> usuarios = new java.util.HashSet<>();
}
