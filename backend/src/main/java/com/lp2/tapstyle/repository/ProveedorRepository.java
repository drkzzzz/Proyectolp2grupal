package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
    List<Proveedor> findByEmpresa_IdEmpresa(Integer empresaId);

    boolean existsByEmpresa_IdEmpresaAndRuc(Integer empresaId, String ruc);
}
