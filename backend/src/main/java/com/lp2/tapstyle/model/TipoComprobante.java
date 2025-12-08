package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tiposcomprobantepago")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoComprobante {

    @Id
    @Column(name = "id_tipo_comprobante")
    private Integer idTipoComprobante;

    @Column(name = "nombre_tipo", nullable = false)
    private String nombreTipo;

    @Column(name = "serie_documento")
    private String serieDocumento;
}
