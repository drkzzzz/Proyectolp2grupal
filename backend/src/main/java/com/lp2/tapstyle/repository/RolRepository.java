package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    Optional<Rol> findByNombreRol(String nombreRol);

    List<Rol> findByEstado(Boolean estado);

    boolean existsByNombreRol(String nombreRol);
}
