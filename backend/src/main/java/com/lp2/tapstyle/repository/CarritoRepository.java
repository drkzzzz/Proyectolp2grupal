package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
    Optional<Carrito> findByUsuario_IdUsuarioAndEmpresa_IdEmpresaAndEstado(
            Integer idUsuario, Integer idEmpresa, String estado);
}
