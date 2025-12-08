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
}
