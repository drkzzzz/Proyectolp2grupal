package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "detallespedidocompra")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DetallesPedidoCompra implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetallePedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_pedido_compra", nullable = false)
    private PedidoCompra pedidoCompra;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_variante", nullable = false)
    private VarianteProducto variante;

    @Column(nullable = false)
    private Integer cantidadSolicitada;

    @Column(nullable = false)
    @Builder.Default
    private Integer cantidadRecibida = 0;

    @Column(nullable = false)
    private BigDecimal precioUnitario;
}
