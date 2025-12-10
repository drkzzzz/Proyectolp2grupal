package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos_pedido")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PagoPedido implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPagoPedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_pedido", nullable = false)
    private PedidoCliente pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_tipopago", nullable = false)
    private TipoPago tipoPago;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime fechaPago = LocalDateTime.now();

    @Column(length = 100)
    private String referenciaPago;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estadoPago = "Completado"; // Completado, Pendiente, Fallido
}
