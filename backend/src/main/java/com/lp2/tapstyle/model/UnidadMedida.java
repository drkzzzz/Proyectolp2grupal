package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "unidadesmedida")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UnidadMedida implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUnidadMedida;

    @NotBlank(message = "El nombre de la unidad es requerido")
    @Column(nullable = false, unique = true, length = 50)
    private String nombreUnidad;

    @Column(length = 10)
    private String abreviatura;
}
