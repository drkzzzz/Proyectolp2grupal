package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ClienteDTO;
import com.lp2.tapstyle.model.Cliente;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.TipoDocumento;
import com.lp2.tapstyle.model.Usuario;
import com.lp2.tapstyle.repository.ClienteRepository;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;

    /**
     * Listar todos los clientes de una empresa
     */
    public List<ClienteDTO> listarPorEmpresa(Integer idEmpresa) {
        return clienteRepository.findByEmpresa_IdEmpresa(idEmpresa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar clientes activos de una empresa
     */
    public List<ClienteDTO> listarActivosPorEmpresa(Integer idEmpresa) {
        return clienteRepository.findByEmpresa_IdEmpresaAndEstado(idEmpresa, true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener cliente por ID
     */
    public ClienteDTO obtenerPorId(Integer id) {
        return clienteRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    /**
     * Crear cliente manual desde admin
     */
    public ClienteDTO crearManual(ClienteDTO dto) {
        // Validar que la empresa exista
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        // Validar email único por empresa
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            if (clienteRepository.existsByEmailAndEmpresa_IdEmpresa(dto.getEmail(), dto.getIdEmpresa())) {
                throw new RuntimeException("Ya existe un cliente con este email en la empresa");
            }
        }

        Cliente cliente = Cliente.builder()
                .empresa(empresa)
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .email(dto.getEmail())
                .numeroDocumento(dto.getNumeroDocumento())
                .telefono(dto.getTelefono())
                .direccion(dto.getDireccion())
                .estado(true)
                .build();

        // Asignar tipo de documento si se proporciona
        if (dto.getIdTipoDocumento() != null) {
            TipoDocumento tipoDocumento = new TipoDocumento();
            tipoDocumento.setIdTipoDocumento(dto.getIdTipoDocumento());
            cliente.setTipoDocumento(tipoDocumento);
        }

        Cliente saved = clienteRepository.save(cliente);
        return convertToDTO(saved);
    }

    /**
     * Actualizar cliente
     */
    public ClienteDTO actualizar(Integer id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        // Validar email único si cambió
        if (dto.getEmail() != null && !dto.getEmail().equals(cliente.getEmail())) {
            if (clienteRepository.existsByEmailAndEmpresa_IdEmpresa(dto.getEmail(),
                    cliente.getEmpresa().getIdEmpresa())) {
                throw new RuntimeException("Ya existe un cliente con este email en la empresa");
            }
        }

        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setNumeroDocumento(dto.getNumeroDocumento());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());

        // Actualizar tipo de documento si se proporciona
        if (dto.getIdTipoDocumento() != null) {
            TipoDocumento tipoDocumento = new TipoDocumento();
            tipoDocumento.setIdTipoDocumento(dto.getIdTipoDocumento());
            cliente.setTipoDocumento(tipoDocumento);
        }

        Cliente updated = clienteRepository.save(cliente);
        return convertToDTO(updated);
    }

    /**
     * Activar/Desactivar cliente (cambiar estado)
     */
    public ClienteDTO toggleEstado(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        cliente.setEstado(!cliente.getEstado());
        Cliente updated = clienteRepository.save(cliente);
        return convertToDTO(updated);
    }

    /**
     * Eliminar cliente (NO USAR - preferir toggleEstado)
     */
    public void eliminar(Integer id) {
        clienteRepository.deleteById(id);
    }

    /**
     * Obtener o crear cliente desde compra web (para implementación futura)
     */
    public Cliente obtenerOCrearClienteDesdeWeb(String email, Integer idEmpresa, Integer idUsuario) {
        // Buscar cliente existente por email
        return clienteRepository.findByEmailAndEmpresa_IdEmpresa(email, idEmpresa)
                .orElseGet(() -> {
                    // Si no existe, crear nuevo cliente vinculado al usuario
                    Usuario usuario = usuarioRepository.findById(idUsuario)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                    Empresa empresa = empresaRepository.findById(idEmpresa)
                            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

                    Cliente nuevoCliente = Cliente.builder()
                            .empresa(empresa)
                            .usuario(usuario)
                            .nombre(usuario.getNombres())
                            .apellido(usuario.getApellidos())
                            .email(usuario.getEmail())
                            .telefono(usuario.getCelular())
                            .numeroDocumento(usuario.getNumeroDocumento())
                            .tipoDocumento(usuario.getTipoDocumento())
                            .estado(true)
                            .build();

                    return clienteRepository.save(nuevoCliente);
                });
    }

    // Conversión DTO <-> Entity

    private ClienteDTO convertToDTO(Cliente cliente) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return ClienteDTO.builder()
                .idCliente(cliente.getIdCliente())
                .idEmpresa(cliente.getEmpresa() != null ? cliente.getEmpresa().getIdEmpresa() : null)
                .idUsuario(cliente.getUsuario() != null ? cliente.getUsuario().getIdUsuario() : null)
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .idTipoDocumento(
                        cliente.getTipoDocumento() != null ? cliente.getTipoDocumento().getIdTipoDocumento() : null)
                .numeroDocumento(cliente.getNumeroDocumento())
                .direccion(cliente.getDireccion())
                .telefono(cliente.getTelefono())
                .email(cliente.getEmail())
                .estado(cliente.getEstado())
                .fechaRegistro(cliente.getFechaRegistro() != null ? cliente.getFechaRegistro().format(formatter) : null)
                .build();
    }
}
