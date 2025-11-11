package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductoDTO {
    private Integer idProducto;
    private Integer idEmpresa;
    private String nombreProducto;
    private String descripcion;
    private Integer idCategoria;
    private Integer idProveedor;
    private Integer idUnidadMedida;
    private String dimensiones;
    private Integer pesoGramos;
    private Integer idMarca;
    private Integer idModelo;
    private Integer idMaterial;
}
