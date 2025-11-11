package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Almacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlmacenRepository extends JpaRepository<Almacen, Integer> {
    List<Almacen> findByEmpresa(Integer empresaId);
}
