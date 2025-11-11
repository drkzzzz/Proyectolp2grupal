package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.UnidadMedida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnidadMedidaRepository extends JpaRepository<UnidadMedida, Integer> {
    Optional<UnidadMedida> findByNombreUnidad(String nombreUnidad);
}
