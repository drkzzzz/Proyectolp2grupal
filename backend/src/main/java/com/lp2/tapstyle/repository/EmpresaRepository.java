package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    Optional<Empresa> findByNombreTienda(String nombreTienda);

    Optional<Empresa> findByRucEmpresa(String rucEmpresa);
}
