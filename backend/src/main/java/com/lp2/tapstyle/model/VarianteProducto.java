package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "VariantesProducto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VarianteProducto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVariante;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(unique = true, length = 50)
    private String codigoSku;

    @NotBlank(message = "La talla es requerida")
    @Column(nullable = false, length = 10)
    private String talla;

    @NotBlank(message = "El color es requerido")
    @Column(nullable = false, length = 50)
    private String color;

    @NotNull(message = "El precio de venta es requerido")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @Column(precision = 10, scale = 2)
    private BigDecimal costoCompra;
}
