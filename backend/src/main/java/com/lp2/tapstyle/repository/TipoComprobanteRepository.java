package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoComprobanteRepository extends JpaRepository<TipoComprobante, Integer> {
}
