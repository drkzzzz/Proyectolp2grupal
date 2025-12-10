package com.lp2.tapstyle.service;

import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.model.Permiso;
import com.lp2.tapstyle.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class RolService {

    private final RolRepository rolRepository;

    public List<Rol> obtenerTodos() {
        return rolRepository.findAll();
    }

    public List<Rol> obtenerActivos() {
        return rolRepository.findByEstado(true);
    }

    public Rol obtenerPorId(Integer id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));
    }

    public Rol crear(Rol rol) {
        if (rolRepository.existsByNombreRol(rol.getNombreRol())) {
            throw new RuntimeException("Ya existe un rol con el nombre: " + rol.getNombreRol());
        }
        rol.setEstado(true);
        return rolRepository.save(rol);
    }

    public Rol actualizar(Integer id, Rol rol) {
        Rol existing = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

        // Validar nombre único si cambió
        if (!existing.getNombreRol().equals(rol.getNombreRol())) {
            if (rolRepository.existsByNombreRol(rol.getNombreRol())) {
                throw new RuntimeException("Ya existe un rol con el nombre: " + rol.getNombreRol());
            }
        }

        existing.setNombreRol(rol.getNombreRol());
        existing.setDescripcion(rol.getDescripcion());

        return rolRepository.save(existing);
    }

    public Rol toggleEstado(Integer id) {
        Rol rol = obtenerPorId(id);
        rol.setEstado(!rol.getEstado());
        return rolRepository.save(rol);
    }

    public Rol asignarPermisos(Integer idRol, Set<Permiso> permisos) {
        Rol rol = obtenerPorId(idRol);
        rol.setPermisos(permisos);
        return rolRepository.save(rol);
    }

    public Set<Permiso> obtenerPermisos(Integer idRol) {
        Rol rol = obtenerPorId(idRol);
        return rol.getPermisos();
    }

    public void eliminar(Integer id) {
        Rol rol = obtenerPorId(id);

        if (!rol.getUsuarios().isEmpty()) {
            throw new RuntimeException("No se puede eliminar el rol porque tiene usuarios asignados");
        }

        rolRepository.deleteById(id);
    }
}
