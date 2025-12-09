package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    Optional<Inventario> findByVariante_IdVarianteAndAlmacen_IdAlmacen(Integer varianteId, Integer almacenId);

    List<Inventario> findByVariante_IdVariante(Integer varianteId);

    List<Inventario> findByAlmacen_IdAlmacen(Integer almacenId);

    @Query("SELECT i FROM Inventario i WHERE i.almacen.empresa.idEmpresa = ?1")
    List<Inventario> findByAlmacen_Empresa_IdEmpresa(Integer empresaId);

    List<Inventario> findByCantidadStockLessThan(Integer stockMinimo);

    @Query("SELECT i FROM Inventario i WHERE i.variante.producto.idProducto = ?1")
    List<Inventario> findByProductoId(Integer idProducto);
}
