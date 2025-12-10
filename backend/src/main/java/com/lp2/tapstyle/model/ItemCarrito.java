package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "items_carrito")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemCarrito implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItemCarrito;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_variante", nullable = false)
    private VarianteProducto variante;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaAgregado = LocalDateTime.now();

    public BigDecimal getSubtotal() {
        return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
}
