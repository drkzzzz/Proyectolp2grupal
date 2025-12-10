package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.PedidoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoClienteRepository extends JpaRepository<PedidoCliente, Long> {
    List<PedidoCliente> findByUsuario_IdUsuarioOrderByFechaPedidoDesc(Integer idUsuario);
    List<PedidoCliente> findByEmpresa_IdEmpresaOrderByFechaPedidoDesc(Integer idEmpresa);
}
