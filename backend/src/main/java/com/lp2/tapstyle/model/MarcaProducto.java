package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "marcasproducto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MarcaProducto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMarca;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @NotBlank(message = "El nombre de la marca es requerido")
    @Column(nullable = false, length = 50)
    private String nombreMarca;
}
