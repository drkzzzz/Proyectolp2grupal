package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.SuscripcionEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuscripcionEmpresaRepository extends JpaRepository<SuscripcionEmpresa, Long> {
    List<SuscripcionEmpresa> findByEmpresaIdEmpresa(Long idEmpresa);

    List<SuscripcionEmpresa> findByEstado(String estado);
}
