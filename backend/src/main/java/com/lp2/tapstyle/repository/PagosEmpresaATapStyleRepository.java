package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.PagosEmpresaATapStyle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagosEmpresaATapStyleRepository extends JpaRepository<PagosEmpresaATapStyle, Long> {
    List<PagosEmpresaATapStyle> findByIdEmpresa(Integer idEmpresa);
}
