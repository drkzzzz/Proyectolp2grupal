package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ClienteDTO;
import com.lp2.tapstyle.model.Cliente;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.repository.ClienteRepository;
import com.lp2.tapstyle.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public List<ClienteDTO> obtenerTodos() {
        return clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO obtenerPorId(Integer id) {
        return clienteRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    public ClienteDTO crear(ClienteDTO dto) {
        Cliente cliente = convertToEntity(dto);
        if (dto.getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            cliente.setUsuario(usuario);
        }
        Cliente saved = clienteRepository.save(cliente);
        return convertToDTO(saved);
    }

    public ClienteDTO actualizar(Integer id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setNumeroDocumento(dto.getNumeroDocumento());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setEstado(dto.getEstado());

        Cliente updated = clienteRepository.save(cliente);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        clienteRepository.deleteById(id);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .idCliente(cliente.getIdCliente())
                .idUsuario(cliente.getUsuario() != null ? cliente.getUsuario().getIdUsuario() : null)
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .numeroDocumento(cliente.getNumeroDocumento())
                .direccion(cliente.getDireccion())
                .telefono(cliente.getTelefono())
                .email(cliente.getEmail())
                .estado(cliente.getEstado())
                .build();
    }

    private Cliente convertToEntity(ClienteDTO dto) {
        return Cliente.builder()
                .idCliente(dto.getIdCliente())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .numeroDocumento(dto.getNumeroDocumento())
                .direccion(dto.getDireccion())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .estado(dto.getEstado())
                .build();
    }
}
