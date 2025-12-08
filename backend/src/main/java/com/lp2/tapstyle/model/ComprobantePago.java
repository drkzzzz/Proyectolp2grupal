package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "comprobantespago")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ComprobantePago implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comprobante")
    private Long idComprobante;

    @Column(name = "id_empresa", nullable = false)
    private Integer idEmpresa;

    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_tipo_comprobante", nullable = false)
    private Integer idTipoComprobante;

    @Column(name = "numero_comprobante", nullable = false)
    private String numeroComprobante;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Column(name = "igv", nullable = false)
    private BigDecimal igv;

    @Column(name = "subtotal", nullable = false)
    private BigDecimal subtotal;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "motivo_anulacion")
    private String motivoAnulacion;
}
