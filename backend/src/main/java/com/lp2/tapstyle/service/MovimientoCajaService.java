package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.MovimientoCajaDTO;
import com.lp2.tapstyle.model.MovimientoCaja;
import com.lp2.tapstyle.repository.MovimientoCajaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MovimientoCajaService {

    private final MovimientoCajaRepository movimientoCajaRepository;

    public List<MovimientoCajaDTO> obtenerTodos() {
        return movimientoCajaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MovimientoCajaDTO> obtenerPorCaja(Integer idCaja) {
        return movimientoCajaRepository.findByIdCajaOrderByFechaMovimientoDesc(idCaja).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MovimientoCajaDTO> obtenerPorTipo(String tipoMovimiento) {
        return movimientoCajaRepository.findByTipoMovimiento(tipoMovimiento).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MovimientoCajaDTO obtenerPorId(Long id) {
        return movimientoCajaRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Movimiento de caja no encontrado"));
    }

    public MovimientoCajaDTO crear(MovimientoCajaDTO dto) {
        MovimientoCaja movimiento = MovimientoCaja.builder()
                .idCaja(dto.getIdCaja())
                .idUsuario(dto.getIdUsuario())
                .tipoMovimiento(dto.getTipoMovimiento())
                .monto(dto.getMonto())
                .descripcion(dto.getDescripcion())
                .fechaMovimiento(LocalDateTime.now())
                .idComprobante(dto.getIdComprobante())
                .build();

        MovimientoCaja saved = movimientoCajaRepository.save(movimiento);
        return convertToDTO(saved);
    }

    public MovimientoCajaDTO actualizar(Long id, MovimientoCajaDTO dto) {
        MovimientoCaja movimiento = movimientoCajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        if (dto.getMonto() != null) {
            movimiento.setMonto(dto.getMonto());
        }
        if (dto.getDescripcion() != null) {
            movimiento.setDescripcion(dto.getDescripcion());
        }

        MovimientoCaja updated = movimientoCajaRepository.save(movimiento);
        return convertToDTO(updated);
    }

    public void eliminar(Long id) {
        movimientoCajaRepository.deleteById(id);
    }

    private MovimientoCajaDTO convertToDTO(MovimientoCaja movimiento) {
        return MovimientoCajaDTO.builder()
                .idMovimientoCaja(movimiento.getIdMovimientoCaja())
                .idCaja(movimiento.getIdCaja())
                .idUsuario(movimiento.getIdUsuario())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .monto(movimiento.getMonto())
                .descripcion(movimiento.getDescripcion())
                .fechaMovimiento(movimiento.getFechaMovimiento())
                .idComprobante(movimiento.getIdComprobante())
                .build();
    }
}
