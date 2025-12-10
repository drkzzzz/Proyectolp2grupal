package com.lp2.tapstyle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CheckoutCarritoRequest {
    private Integer idUsuario;
    private Integer idEmpresa;
    private List<ItemPedido> detalles;

    @JsonProperty("montoPago")
    private Number montoPago;

    @JsonProperty("montoEnvio")
    private Number montoEnvio;

    private String estado;
    private String direccionEnvio;
    private String telefonoContacto;
    private String notas;

    // Helper methods para convertir a BigDecimal
    public BigDecimal getMontoPagoBD() {
        if (montoPago == null)
            return BigDecimal.ZERO;
        if (montoPago instanceof BigDecimal)
            return (BigDecimal) montoPago;
        return new BigDecimal(montoPago.toString());
    }

    public BigDecimal getMontoEnvioBD() {
        if (montoEnvio == null)
            return BigDecimal.ZERO;
        if (montoEnvio instanceof BigDecimal)
            return (BigDecimal) montoEnvio;
        return new BigDecimal(montoEnvio.toString());
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @Builder
    public static class ItemPedido {
        private Integer idProductoVariante;
        private Integer cantidad;

        @JsonProperty("precioUnitario")
        private Number precioUnitario;

        // Helper method para convertir a BigDecimal
        public BigDecimal getPrecioUnitarioBD() {
            if (precioUnitario == null)
                return BigDecimal.ZERO;
            if (precioUnitario instanceof BigDecimal)
                return (BigDecimal) precioUnitario;
            return new BigDecimal(precioUnitario.toString());
        }
    }
}
