package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.ComprobantePago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComprobantePagoRepository extends JpaRepository<ComprobantePago, Long> {
    List<ComprobantePago> findByIdEmpresa(Integer idEmpresa);

    List<ComprobantePago> findByIdCliente(Integer idCliente);

    List<ComprobantePago> findByEstado(String estado);

    List<ComprobantePago> findByIdEmpresaAndEstado(Integer idEmpresa, String estado);
}
