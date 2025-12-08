package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.PedidoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, Long> {
    List<PedidoCompra> findByIdProveedor(Integer idProveedor);

    List<PedidoCompra> findByEstadoPedido(String estadoPedido);

    @Query(value = "SELECT p.* FROM pedidoscompra p JOIN usuarios u ON p.id_usuario = u.id_usuario WHERE u.id_empresa = :idEmpresa", nativeQuery = true)
    List<PedidoCompra> findByEmpresa(@Param("idEmpresa") Integer idEmpresa);
}
