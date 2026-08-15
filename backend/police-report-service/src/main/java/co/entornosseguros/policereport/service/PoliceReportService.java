package co.entornosseguros.policereport.service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.entornosseguros.policereport.domain.PoliceReportEntity;
import co.entornosseguros.policereport.repository.PoliceReportRepository;
import co.entornosseguros.policereport.security.AuthenticatedUser;
import co.entornosseguros.policereport.web.dto.CreatePoliceReportRequest;
import co.entornosseguros.policereport.web.dto.PoliceReportResponse;

@Service
public class PoliceReportService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PoliceReportService.class);

    private final PoliceReportRepository policeReportRepository;

    public PoliceReportService(PoliceReportRepository policeReportRepository) {
        this.policeReportRepository = policeReportRepository;
    }

    @Transactional
    public PoliceReportResponse create(CreatePoliceReportRequest request) {
        LOGGER.debug("POST /api/v1/police-reports enteredService=true requestPoliceId={}", request.idUsuarioPolicia());
        validatePoliceOwner(request);

        if (!policeReportRepository.findByIdIncidenteOrderByFechaReporteDesc(request.idIncidente()).isEmpty()) {
            throw new PoliceReportConflictException("Ya existe un informe policial para este incidente");
        }

        PoliceReportEntity report = new PoliceReportEntity();
        report.setIdIncidente(request.idIncidente());
        report.setIdUsuarioPolicia(request.idUsuarioPolicia());
        report.setHuboHeridos(request.huboHeridos());
        report.setDescripcionAtencion(request.descripcionAtencion().trim());

        PoliceReportEntity saved = policeReportRepository.save(report);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PoliceReportResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<PoliceReportResponse> getByIncident(Long idIncidente) {
        return policeReportRepository.findByIdIncidenteOrderByFechaReporteDesc(idIncidente).stream()
            .sorted(Comparator.comparing(PoliceReportEntity::getFechaReporte).reversed())
            .map(this::toResponse)
            .toList();
    }

    private void validatePoliceOwner(CreatePoliceReportRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null
            || authentication.getAuthorities().stream().noneMatch(authority ->
                "ROLE_POLICIA".equals(authority.getAuthority()) || "ROLE_ADMIN".equals(authority.getAuthority()))) {
            throw new AccessDeniedException("No autorizado para crear informes policiales");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthenticatedUser authenticatedUser) || authenticatedUser.id() == null) {
            throw new AccessDeniedException("No fue posible identificar al usuario autenticado");
        }

        boolean isPolicia = authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_POLICIA".equals(authority.getAuthority()));

        LOGGER.debug(
            "Police owner validation principalId={} authorities={} requestPoliceId={}",
            authenticatedUser.id(),
            authentication.getAuthorities(),
            request.idUsuarioPolicia()
        );

        if (isPolicia && !Objects.equals(authenticatedUser.id(), request.idUsuarioPolicia())) {
            throw new AccessDeniedException("No tienes permiso para crear informes para otro usuario policial");
        }
    }

    private PoliceReportEntity findById(Long id) {
        return policeReportRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reporte policial no encontrado"));
    }

    private PoliceReportResponse toResponse(PoliceReportEntity entity) {
        return new PoliceReportResponse(
            entity.getId(),
            entity.getIdIncidente(),
            entity.getIdUsuarioPolicia(),
            entity.getHuboHeridos(),
            entity.getDescripcionAtencion(),
            entity.getFechaReporte(),
            entity.getFechaActualizacion()
        );
    }
}