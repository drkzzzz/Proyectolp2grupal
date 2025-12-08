package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.ComprobantePagoDTO;
import com.lp2.tapstyle.model.ComprobantePago;
import com.lp2.tapstyle.repository.ComprobantePagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComprobantePagoService {

    private final ComprobantePagoRepository comprobantePagoRepository;

    public List<ComprobantePagoDTO> obtenerTodos() {
        return comprobantePagoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComprobantePagoDTO> obtenerPorEmpresa(Integer idEmpresa) {
        return comprobantePagoRepository.findByIdEmpresa(idEmpresa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComprobantePagoDTO> obtenerPorEstado(String estado) {
        return comprobantePagoRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ComprobantePagoDTO obtenerPorId(Long id) {
        return comprobantePagoRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
    }

    public ComprobantePagoDTO crear(ComprobantePagoDTO dto) {
        ComprobantePago comprobante = ComprobantePago.builder()
                .idEmpresa(dto.getIdEmpresa())
                .idCliente(dto.getIdCliente())
                .idUsuario(dto.getIdUsuario())
                .idTipoComprobante(dto.getIdTipoComprobante())
                .numeroComprobante(dto.getNumeroComprobante())
                .fechaEmision(LocalDateTime.now())
                .total(dto.getTotal())
                .igv(dto.getIgv())
                .subtotal(dto.getSubtotal())
                .estado(dto.getEstado() != null ? dto.getEstado() : "Activo")
                .motivoAnulacion(dto.getMotivoAnulacion())
                .build();

        ComprobantePago saved = comprobantePagoRepository.save(comprobante);
        return convertToDTO(saved);
    }

    public ComprobantePagoDTO actualizar(Long id, ComprobantePagoDTO dto) {
        ComprobantePago comprobante = comprobantePagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));

        if (dto.getNumeroComprobante() != null) {
            comprobante.setNumeroComprobante(dto.getNumeroComprobante());
        }
        if (dto.getTotal() != null) {
            comprobante.setTotal(dto.getTotal());
        }
        if (dto.getIgv() != null) {
            comprobante.setIgv(dto.getIgv());
        }
        if (dto.getSubtotal() != null) {
            comprobante.setSubtotal(dto.getSubtotal());
        }
        if (dto.getEstado() != null) {
            comprobante.setEstado(dto.getEstado());
        }
        if (dto.getMotivoAnulacion() != null) {
            comprobante.setMotivoAnulacion(dto.getMotivoAnulacion());
        }

        ComprobantePago updated = comprobantePagoRepository.save(comprobante);
        return convertToDTO(updated);
    }

    public void eliminar(Long id) {
        comprobantePagoRepository.deleteById(id);
    }

    private ComprobantePagoDTO convertToDTO(ComprobantePago comprobante) {
        return ComprobantePagoDTO.builder()
                .idComprobante(comprobante.getIdComprobante())
                .idEmpresa(comprobante.getIdEmpresa())
                .idCliente(comprobante.getIdCliente())
                .idUsuario(comprobante.getIdUsuario())
                .idTipoComprobante(comprobante.getIdTipoComprobante())
                .numeroComprobante(comprobante.getNumeroComprobante())
                .fechaEmision(comprobante.getFechaEmision())
                .total(comprobante.getTotal())
                .igv(comprobante.getIgv())
                .subtotal(comprobante.getSubtotal())
                .estado(comprobante.getEstado())
                .motivoAnulacion(comprobante.getMotivoAnulacion())
                .build();
    }
}
