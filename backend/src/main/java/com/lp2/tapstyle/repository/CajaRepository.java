package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Integer> {
    List<Caja> findByEmpresa_IdEmpresa(Integer idEmpresa);
    List<Caja> findByEstado(String estado);
}
