package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "Proveedores")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Proveedor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProveedor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @NotBlank(message = "La razón social es requerida")
    @Column(nullable = false, length = 255)
    private String razonSocial;

    @Column(length = 100)
    private String nombreComercial;

    @Column(length = 20)
    private String ruc;

    @Column(length = 100)
    private String rubro;

    @Column(length = 255)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Email(message = "El email debe ser válido")
    @Column(length = 100)
    private String email;
}
