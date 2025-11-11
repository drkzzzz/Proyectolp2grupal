package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    Optional<Inventario> findByVarianteAndAlmacen(Integer varianteId, Integer almacenId);

    List<Inventario> findByAlmacen(Integer almacenId);

    List<Inventario> findByCantidadStockLessThan(Integer stockMinimo);
}
