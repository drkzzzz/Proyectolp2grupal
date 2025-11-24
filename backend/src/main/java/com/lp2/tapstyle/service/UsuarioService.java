package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.UsuarioDTO;
import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.repository.RolRepository;
import com.lp2.tapstyle.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public UsuarioDTO crear(UsuarioDTO dto) {
        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Ya existe un usuario con el nombre: " + dto.getUsername());
        }

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + dto.getEmail());
        }

        Usuario usuario = convertToEntity(dto);
        usuario.setContraseñaHash(dto.getUsername());

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + dto.getIdRol()));
        usuario.setRol(rol);

        Usuario saved = usuarioRepository.save(usuario);
        return convertToDTO(saved);
    }

    public UsuarioDTO actualizar(Integer id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setNumeroDocumento(dto.getNumeroDocumento());
        usuario.setCelular(dto.getCelular());
        usuario.setDireccion(dto.getDireccion());
        usuario.setEmail(dto.getEmail());
        usuario.setEstado(dto.getEstado());

        Usuario updated = usuarioRepository.save(usuario);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public UsuarioDTO obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
    }

    public Usuario obtenerEntidadPorUsernameOEmail(String usernameOrEmail) {
        return usuarioRepository.findByUsername(usernameOrEmail)
                .or(() -> usuarioRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .idEmpresa(usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null)
                .idRol(usuario.getRol().getIdRol())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .numeroDocumento(usuario.getNumeroDocumento())
                .celular(usuario.getCelular())
                .direccion(usuario.getDireccion())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .estado(usuario.getEstado())
                .build();
    }

    private Usuario convertToEntity(UsuarioDTO dto) {
        return Usuario.builder()
                .idUsuario(dto.getIdUsuario())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .numeroDocumento(dto.getNumeroDocumento())
                .celular(dto.getCelular())
                .direccion(dto.getDireccion())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .estado(dto.getEstado())
                .build();
    }
}
