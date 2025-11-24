package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByEmpresa_IdEmpresa(Integer empresaId);

    Optional<Producto> findByEmpresa_IdEmpresaAndNombreProducto(Integer empresaId, String nombreProducto);

    List<Producto> findByCategoria_IdCategoria(Integer categoriaId);
}
