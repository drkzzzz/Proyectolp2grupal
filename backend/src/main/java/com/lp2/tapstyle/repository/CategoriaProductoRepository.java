package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.CategoriaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Integer> {
    Optional<CategoriaProducto> findByNombreCategoria(String nombreCategoria);
}
