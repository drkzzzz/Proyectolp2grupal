package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProveedorDTO {
    private Integer idProveedor;
    private Integer idEmpresa;
    private String razonSocial;
    private String nombreComercial;
    private String ruc;
    private String rubro;
    private String direccion;
    private String telefono;
    private String email;
}
