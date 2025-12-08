package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "productos")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Producto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProducto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @NotBlank(message = "El nombre del producto es requerido")
    @Column(nullable = false, length = 100)
    private String nombreProducto;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaProducto categoria;

    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_unidad_medida", nullable = false)
    private UnidadMedida unidadMedida;

    @Column(length = 50)
    private String dimensiones;

    @Column
    private Integer pesoGramos;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private MarcaProducto marca;

    @ManyToOne
    @JoinColumn(name = "id_modelo")
    private Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "id_material")
    private MaterialProducto material;
}