package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.AperturaCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AperturaCajaRepository extends JpaRepository<AperturaCaja, Long> {

    // Buscar la última apertura de una caja que no tenga cierre (aunque idealmente
    // la lógica de negocio controla esto)
    // O mejor, buscar la última apertura por fecha/hora descendente
    Optional<AperturaCaja> findTopByCaja_IdCajaOrderByFechaAperturaDescHoraAperturaDesc(Integer idCaja);
}
