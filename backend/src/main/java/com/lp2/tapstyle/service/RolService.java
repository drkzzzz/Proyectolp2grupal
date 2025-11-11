package com.lp2.tapstyle.service;

import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RolService {

    private final RolRepository rolRepository;

    public List<Rol> obtenerTodos() {
        return rolRepository.findAll();
    }

    public Rol obtenerPorId(Integer id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));
    }

    public Rol crear(Rol rol) {
        if (rolRepository.findByNombreRol(rol.getNombreRol()).isPresent()) {
            throw new RuntimeException("Ya existe un rol con el nombre: " + rol.getNombreRol());
        }
        return rolRepository.save(rol);
    }

    public Rol actualizar(Integer id, Rol rol) {
        Rol existing = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

        existing.setNombreRol(rol.getNombreRol());
        existing.setEstado(rol.getEstado());
        existing.setDescripcion(rol.getDescripcion());

        return rolRepository.save(existing);
    }

    public void eliminar(Integer id) {
        rolRepository.deleteById(id);
    }
}
