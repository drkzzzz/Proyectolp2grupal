package com.lp2.tapstyle.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tipo_pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipopago")
    private Integer idTipoPago;

    @Column(name = "id_empresa")
    private Integer idEmpresa;

    @Column(name = "tipo_pago", nullable = false, length = 100)
    private String tipoPago; // Nombre del método (Efectivo, Yape, etc.)

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;
}
