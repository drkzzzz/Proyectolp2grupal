package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ProveedorDTO;
import com.lp2.tapstyle.model.Empresa;
import com.lp2.tapstyle.model.Proveedor;
import com.lp2.tapstyle.repository.EmpresaRepository;
import com.lp2.tapstyle.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final EmpresaRepository empresaRepository;

    public List<ProveedorDTO> obtenerTodos() {
        return proveedorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProveedorDTO> obtenerPorEmpresa(Integer empresaId) {
        return proveedorRepository.findByEmpresa_IdEmpresa(empresaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProveedorDTO obtenerPorId(Integer id) {
        return proveedorRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));
    }

    public ProveedorDTO crear(ProveedorDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + dto.getIdEmpresa()));

        if (dto.getRuc() != null && proveedorRepository.existsByEmpresa_IdEmpresaAndRuc(dto.getIdEmpresa(), dto.getRuc())) {
            throw new RuntimeException("Ya existe un proveedor con este RUC en la empresa");
        }

        Proveedor proveedor = convertToEntity(dto, empresa);
        Proveedor saved = proveedorRepository.save(proveedor);
        return convertToDTO(saved);
    }

    public ProveedorDTO actualizar(Integer id, ProveedorDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));

        proveedor.setRazonSocial(dto.getRazonSocial());
        proveedor.setNombreComercial(dto.getNombreComercial());
        proveedor.setRuc(dto.getRuc());
        proveedor.setRubro(dto.getRubro());
        proveedor.setDireccion(dto.getDireccion());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setEmail(dto.getEmail());

        Proveedor updated = proveedorRepository.save(proveedor);
        return convertToDTO(updated);
    }

    public void eliminar(Integer id) {
        proveedorRepository.deleteById(id);
    }

    private ProveedorDTO convertToDTO(Proveedor proveedor) {
        return ProveedorDTO.builder()
                .idProveedor(proveedor.getIdProveedor())
                .idEmpresa(proveedor.getEmpresa().getIdEmpresa())
                .razonSocial(proveedor.getRazonSocial())
                .nombreComercial(proveedor.getNombreComercial())
                .ruc(proveedor.getRuc())
                .rubro(proveedor.getRubro())
                .direccion(proveedor.getDireccion())
                .telefono(proveedor.getTelefono())
                .email(proveedor.getEmail())
                .build();
    }

    private Proveedor convertToEntity(ProveedorDTO dto, Empresa empresa) {
        return Proveedor.builder()
                .empresa(empresa)
                .razonSocial(dto.getRazonSocial())
                .nombreComercial(dto.getNombreComercial())
                .ruc(dto.getRuc())
                .rubro(dto.getRubro())
                .direccion(dto.getDireccion())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .build();
    }
}
