package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByEmpresa(Integer empresaId);

    Optional<Producto> findByEmpresaAndNombreProducto(Integer empresaId, String nombreProducto);

    List<Producto> findByCategoria(Integer categoriaId);
}
