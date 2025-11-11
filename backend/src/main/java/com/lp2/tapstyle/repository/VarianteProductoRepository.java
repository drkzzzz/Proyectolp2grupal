package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Integer> {
    List<VarianteProducto> findByProducto(Integer productoId);

    boolean existsByCodigoSku(String codigoSku);
}
