package com.lp2.tapstyle.repository;

import com.lp2.tapstyle.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    // Query nativa para obtener los NOMBRES de los módulos de un plan
    // Unimos plan_modulos con modulosistema para sacar el string 'DASHBOARD', etc.
    @Query(value = "SELECT m.nombre_modulo FROM plan_modulos pm " +
            "JOIN modulosistema m ON pm.id_modulo = m.id_modulo " +
            "WHERE pm.id_plan = :planId", nativeQuery = true)
    List<String> findModulosByPlanId(Long planId);
}
