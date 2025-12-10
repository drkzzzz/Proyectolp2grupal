package com.lp2.tapstyle.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CheckoutRequest {
    private Integer idUsuario;
    private Integer idEmpresa;
    private Integer idCliente;
    private String direccionEnvio;
    private String telefonoContacto;
    private String notas;
    private List<PagoInfo> pagos;

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @Builder
    public static class PagoInfo {
        private Integer idTipoPago;
        private String referenciaPago;
    }
}
