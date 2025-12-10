package com.lp2.tapstyle.service;

import com.lp2.tapstyle.model.Permiso;
import com.lp2.tapstyle.repository.PermisoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PermisoService {

    private final PermisoRepository permisoRepository;

    /**
     * Listar todos los permisos (ordenados alfabéticamente)
     */
    public List<Permiso> listarTodos() {
        return permisoRepository.findAllByOrderByNombrePermisoAsc();
    }

    /**
     * Obtener permiso por ID
     */
    public Permiso obtenerPorId(Integer id) {
        return permisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado con id: " + id));
    }

    /**
     * Crear nuevo permiso
     */
    public Permiso crear(Permiso permiso) {
        if (permisoRepository.existsByNombrePermiso(permiso.getNombrePermiso())) {
            throw new RuntimeException("Ya existe un permiso con el nombre: " + permiso.getNombrePermiso());
        }
        return permisoRepository.save(permiso);
    }

    /**
     * Actualizar permiso
     */
    public Permiso actualizar(Integer id, Permiso permisoActualizado) {
        Permiso permiso = obtenerPorId(id);

        // Validar nombre único si cambió
        if (!permiso.getNombrePermiso().equals(permisoActualizado.getNombrePermiso())) {
            if (permisoRepository.existsByNombrePermiso(permisoActualizado.getNombrePermiso())) {
                throw new RuntimeException(
                        "Ya existe un permiso con el nombre: " + permisoActualizado.getNombrePermiso());
            }
        }

        permiso.setNombrePermiso(permisoActualizado.getNombrePermiso());
        permiso.setDescripcion(permisoActualizado.getDescripcion());

        return permisoRepository.save(permiso);
    }

    /**
     * Eliminar permiso
     */
    public void eliminar(Integer id) {
        Permiso permiso = obtenerPorId(id);
        permisoRepository.deleteById(id);
    }
}
