package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByUsuario_IdUsuario(Integer usuarioId);

    List<Cliente> findByEmpresa_IdEmpresa(Integer idEmpresa);

    List<Cliente> findByEmpresa_IdEmpresaAndEstado(Integer idEmpresa, Boolean estado);

    Optional<Cliente> findByEmailAndEmpresa_IdEmpresa(String email, Integer idEmpresa);

    boolean existsByEmailAndEmpresa_IdEmpresa(String email, Integer idEmpresa);
}
