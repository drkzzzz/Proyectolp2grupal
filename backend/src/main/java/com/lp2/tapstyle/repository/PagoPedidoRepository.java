package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.PagoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoPedidoRepository extends JpaRepository<PagoPedido, Long> {
}
