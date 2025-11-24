package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByUsuario_IdUsuario(Integer usuarioId);

    Optional<Cliente> findByEmail(String email);
}
