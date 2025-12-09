package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.FacturaSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaSuscripcionRepository extends JpaRepository<FacturaSuscripcion, Long> {
    List<FacturaSuscripcion> findByIdEmpresaAndEstado(Integer idEmpresa, String estado);

    List<FacturaSuscripcion> findByIdEmpresa(Integer idEmpresa);
}
