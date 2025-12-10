package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    Optional<Permiso> findByNombrePermiso(String nombrePermiso);

    boolean existsByNombrePermiso(String nombrePermiso);

    List<Permiso> findAllByOrderByNombrePermisoAsc();
}
