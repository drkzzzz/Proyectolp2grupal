package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "tipodocumento")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TipoDocumento implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTipoDocumento;

    @Column(nullable = false, unique = true, length = 50)
    private String nombreTipoDocumento;
}
