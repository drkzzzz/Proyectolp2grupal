package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductoConStockDTO {
    private Integer idProducto;
    private Integer idEmpresa;
    private String nombreProducto;
    private String descripcion;
    private Integer idCategoria;
    private String nombreCategoria;
    private Integer idProveedor;
    private String nombreProveedor;
    private Integer idUnidadMedida;
    private String nombreUnidad;
    private String dimensiones;
    private Integer pesoGramos;
    private BigDecimal precio;
    private Integer idMarca;
    private String nombreMarca;
    private Integer idModelo;
    private String nombreModelo;
    private Integer idMaterial;
    private String nombreMaterial;
    private Integer stock; // Stock total de todas las variantes
}
