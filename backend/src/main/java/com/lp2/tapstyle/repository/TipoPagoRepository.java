package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.TipoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoPagoRepository extends JpaRepository<TipoPago, Integer> {
    java.util.List<TipoPago> findByIdEmpresa(Integer idEmpresa);
}
