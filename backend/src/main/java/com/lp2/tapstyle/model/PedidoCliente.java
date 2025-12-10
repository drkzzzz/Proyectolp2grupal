package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos_clientes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PedidoCliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;

    @Column(nullable = false, unique = true, length = 50)
    private String numeroPedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal igv = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Pendiente"; // Pendiente, Procesando, Completado, Cancelado

    @Column(length = 255)
    private String direccionEnvio;

    @Column(length = 20)
    private String telefonoContacto;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedidoCliente> detalles;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PagoPedido> pagos;
}
