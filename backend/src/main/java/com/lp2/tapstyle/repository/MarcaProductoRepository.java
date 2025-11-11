package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.MarcaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarcaProductoRepository extends JpaRepository<MarcaProducto, Integer> {
    List<MarcaProducto> findByEmpresa(Integer empresaId);
}
