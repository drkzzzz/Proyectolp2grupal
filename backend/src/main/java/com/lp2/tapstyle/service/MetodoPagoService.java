package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.MetodoPagoDTO;
import com.lp2.tapstyle.model.TipoPago;
import com.lp2.tapstyle.repository.TipoPagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetodoPagoService {

    private final TipoPagoRepository tipoPagoRepository;

    public List<MetodoPagoDTO> obtenerTodos(Integer idEmpresa) {
        return tipoPagoRepository.findByIdEmpresa(idEmpresa).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public MetodoPagoDTO obtenerPorId(Integer id) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
        return convertToDTO(tipoPago);
    }

    public MetodoPagoDTO crear(MetodoPagoDTO dto, Integer idEmpresa) {
        TipoPago tipoPago = TipoPago.builder()
                .idEmpresa(idEmpresa)
                .tipoPago(dto.getTipoPago())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        TipoPago guardado = tipoPagoRepository.save(tipoPago);
        return convertToDTO(guardado);
    }

    public MetodoPagoDTO actualizar(Integer id, MetodoPagoDTO dto) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
        tipoPago.setTipoPago(dto.getTipoPago());
        if (dto.getActivo() != null) {
            tipoPago.setActivo(dto.getActivo());
        }
        TipoPago actualizado = tipoPagoRepository.save(tipoPago);
        return convertToDTO(actualizado);
    }

    public void eliminar(Integer id) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
        tipoPagoRepository.delete(tipoPago);
    }

    private MetodoPagoDTO convertToDTO(TipoPago tipoPago) {
        return MetodoPagoDTO.builder()
                .idTipoPago(tipoPago.getIdTipoPago())
                .tipoPago(tipoPago.getTipoPago())
                .activo(tipoPago.getActivo())
                .build();
    }
}
