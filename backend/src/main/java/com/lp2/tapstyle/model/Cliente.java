package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "Clientes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario;

    @NotBlank(message = "El nombre es requerido")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido es requerido")
    @Column(nullable = false, length = 100)
    private String apellido;

    @ManyToOne
    @JoinColumn(name = "id_tipodocumento")
    private TipoDocumento tipoDocumento;

    @Column(length = 20)
    private String numeroDocumento;

    @Column(length = 255)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Email(message = "El email debe ser válido")
    @Column(length = 100)
    private String email;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;
}
