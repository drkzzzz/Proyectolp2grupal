package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    Optional<ItemCarrito> findByCarrito_IdCarritoAndVariante_IdVariante(
            Integer idCarrito, Integer idVariante);
}
