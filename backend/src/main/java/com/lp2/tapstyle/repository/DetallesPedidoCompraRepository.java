package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.DetallesPedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallesPedidoCompraRepository extends JpaRepository<DetallesPedidoCompra, Long> {
    List<DetallesPedidoCompra> findByPedidoCompra_IdPedidoCompra(Long idPedidoCompra);
}
