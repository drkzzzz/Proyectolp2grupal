package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.DetallePedidoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoClienteRepository extends JpaRepository<DetallePedidoCliente, Long> {
}
