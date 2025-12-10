package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.MaterialProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialProductoRepository extends JpaRepository<MaterialProducto, Integer> {
    Optional<MaterialProducto> findByNombreMaterial(String nombreMaterial);
}
