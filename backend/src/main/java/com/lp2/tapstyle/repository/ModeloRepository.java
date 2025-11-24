package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo, Integer> {
    List<Modelo> findByMarca_IdMarca(Integer marcaId);
}
