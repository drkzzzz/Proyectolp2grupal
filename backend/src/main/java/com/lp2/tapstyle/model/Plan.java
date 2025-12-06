package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "planes")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan")
    private Long idPlan;

    @Column(name = "nombre_plan", nullable = false)
    private String nombrePlan;

    @Column(name = "precio_mensual")
    private BigDecimal precioMensual;

    @Column(name = "comision_adicional")
    private BigDecimal comisionAdicional; // Porcentaje, ej: 2.00

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "estado")
    private Integer estado; // 1 activo, 0 inactivo
}
