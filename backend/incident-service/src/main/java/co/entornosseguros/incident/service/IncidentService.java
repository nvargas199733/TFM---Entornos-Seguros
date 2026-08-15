package co.entornosseguros.incident.service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.entornosseguros.incident.domain.IncidentEntity;
import co.entornosseguros.incident.domain.IncidentEvidenceEntity;
import co.entornosseguros.incident.domain.IncidentStatusEntity;
import co.entornosseguros.incident.domain.IncidentStatusHistoryEntity;
import co.entornosseguros.incident.domain.IncidentTypeEntity;
import co.entornosseguros.incident.repository.IncidentEvidenceRepository;
import co.entornosseguros.incident.repository.IncidentRepository;
import co.entornosseguros.incident.repository.IncidentStatusHistoryRepository;
import co.entornosseguros.incident.repository.IncidentStatusRepository;
import co.entornosseguros.incident.repository.IncidentTypeRepository;
import co.entornosseguros.incident.security.AuthenticatedUser;
import co.entornosseguros.incident.web.dto.ChangeIncidentStatusRequest;
import co.entornosseguros.incident.web.dto.CreateEvidenceRequest;
import co.entornosseguros.incident.web.dto.CreateIncidentRequest;
import co.entornosseguros.incident.web.dto.EvidenceResponse;
import co.entornosseguros.incident.web.dto.IncidentResponse;
import co.entornosseguros.incident.web.dto.IncidentStatusHistoryResponse;
import co.entornosseguros.incident.web.dto.IncidentStatusResponse;
import co.entornosseguros.incident.web.dto.IncidentTypeResponse;

@Service
public class IncidentService {

    private static final String DEFAULT_INITIAL_STATUS = "PENDIENTE";
    private static final Logger LOGGER = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository incidentRepository;
    private final IncidentTypeRepository incidentTypeRepository;
    private final IncidentStatusRepository incidentStatusRepository;
    private final IncidentStatusHistoryRepository incidentStatusHistoryRepository;
    private final IncidentEvidenceRepository incidentEvidenceRepository;

    public IncidentService(
        IncidentRepository incidentRepository,
        IncidentTypeRepository incidentTypeRepository,
        IncidentStatusRepository incidentStatusRepository,
        IncidentStatusHistoryRepository incidentStatusHistoryRepository,
        IncidentEvidenceRepository incidentEvidenceRepository
    ) {
        this.incidentRepository = incidentRepository;
        this.incidentTypeRepository = incidentTypeRepository;
        this.incidentStatusRepository = incidentStatusRepository;
        this.incidentStatusHistoryRepository = incidentStatusHistoryRepository;
        this.incidentEvidenceRepository = incidentEvidenceRepository;
    }

    @Transactional
    public IncidentResponse createIncident(CreateIncidentRequest request) {
        validateOwnerRequest(request);

        IncidentTypeEntity type = incidentTypeRepository.findById(request.idTipoIncidente())
            .orElseThrow(() -> new IllegalArgumentException("Tipo de incidente no existe"));

        IncidentStatusEntity initialStatus = incidentStatusRepository.findByNombreIgnoreCase(DEFAULT_INITIAL_STATUS)
            .or(() -> incidentStatusRepository.findAll().stream().findFirst())
            .orElseThrow(() -> new IllegalArgumentException("No hay estados de incidente configurados"));

        IncidentEntity incident = new IncidentEntity();
        incident.setIdUsuario(request.idUsuario());
        incident.setTipoIncidente(type);
        incident.setEstadoIncidente(initialStatus);
        incident.setDescripcion(request.descripcion().trim());
        incident.setLatitud(request.latitud());
        incident.setLongitud(request.longitud());
        incident.setDireccionReferencia(request.direccionReferencia());

        IncidentEntity saved = incidentRepository.save(incident);
        saveStatusHistory(saved, initialStatus, request.idUsuario(), "Incidente creado por ciudadano");

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidents(Long idUsuario) {
        Long effectiveUserId = resolveAuthorizedListUserId(idUsuario);

        List<IncidentEntity> incidents = effectiveUserId == null
            ? incidentRepository.findAll()
            : incidentRepository.findByIdUsuarioOrderByFechaReporteDesc(effectiveUserId);

        return incidents.stream()
            .sorted(Comparator.comparing(IncidentEntity::getFechaReporte).reversed())
            .map(this::toResponse)
            .toList();
    }

    private Long resolveAuthorizedListUserId(Long requestedUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            throw new AccessDeniedException("No autorizado para consultar incidentes");
        }

        boolean isUsuario = authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_USUARIO".equals(authority.getAuthority()));

        if (!isUsuario) {
            return requestedUserId;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthenticatedUser authenticatedUser) || authenticatedUser.id() == null) {
            throw new AccessDeniedException("No fue posible identificar al usuario autenticado");
        }

        Long authUserId = authenticatedUser.id();
        if (requestedUserId == null) {
            return authUserId;
        }

        if (!Objects.equals(authUserId, requestedUserId)) {
            throw new AccessDeniedException("No tienes permiso para consultar incidentes de otro usuario");
        }

        return requestedUserId;
    }

    @Transactional(readOnly = true)
    public IncidentResponse getById(Long id) {
        IncidentEntity incident = findIncident(id);
        validateOwnerIncidentAccess(incident);
        return toResponse(incident);
    }

    @Transactional(readOnly = true)
    public List<IncidentStatusHistoryResponse> getHistory(Long incidentId) {
        IncidentEntity incident = findIncident(incidentId);
        validateOwnerIncidentAccess(incident);

        return incidentStatusHistoryRepository.findByIncidenteIdOrderByFechaCambioDesc(incidentId).stream()
            .map(this::toHistoryResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> getEvidence(Long incidentId) {
        IncidentEntity incident = findIncident(incidentId);
        validateOwnerIncidentAccess(incident);

        return incidentEvidenceRepository.findByIncidenteIdOrderByFechaCargaDesc(incidentId).stream()
            .map(this::toEvidenceResponse)
            .toList();
    }

    @Transactional
    public EvidenceResponse addEvidence(Long incidentId, CreateEvidenceRequest request) {
        IncidentEntity incident = findIncident(incidentId);
        validateOwnerIncidentAccess(incident);

        IncidentEvidenceEntity evidence = new IncidentEvidenceEntity();
        evidence.setIncidente(incident);
        evidence.setTipoArchivo(request.tipoArchivo().trim());
        evidence.setUrlArchivo(request.urlArchivo().trim());
        evidence.setNombreArchivo(request.nombreArchivo().trim());

        IncidentEvidenceEntity saved = incidentEvidenceRepository.save(evidence);
        return toEvidenceResponse(saved);
    }

    @Transactional
    public IncidentResponse changeStatus(Long incidentId, ChangeIncidentStatusRequest request) {
        IncidentEntity incident = findIncident(incidentId);
        validatePoliceStatusChange(request);

        IncidentStatusEntity nextStatus = incidentStatusRepository.findById(request.idEstadoIncidente())
            .orElseThrow(() -> new IllegalArgumentException("Estado de incidente no existe"));

        incident.setEstadoIncidente(nextStatus);
        IncidentEntity saved = incidentRepository.save(incident);

        saveStatusHistory(saved, nextStatus, request.idUsuarioResponsable(), request.observacion());
        return toResponse(saved);
    }

    private void validatePoliceStatusChange(ChangeIncidentStatusRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null
            || authentication.getAuthorities().stream().noneMatch(authority -> "ROLE_POLICIA".equals(authority.getAuthority()))) {
            throw new AccessDeniedException("No autorizado para actualizar el estado del incidente");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthenticatedUser authenticatedUser) || authenticatedUser.id() == null
            || !Objects.equals(authenticatedUser.id(), request.idUsuarioResponsable())) {
            throw new AccessDeniedException("No tienes permiso para actualizar este incidente como otro usuario policial");
        }
    }

    @Transactional(readOnly = true)
    public List<IncidentTypeResponse> getIncidentTypes() {
        return incidentTypeRepository.findAll().stream()
            .sorted(Comparator.comparing(IncidentTypeEntity::getNombre))
            .map(entity -> new IncidentTypeResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getEstadoActivo()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<IncidentStatusResponse> getIncidentStatuses() {
        return incidentStatusRepository.findAll().stream()
            .sorted(Comparator.comparing(IncidentStatusEntity::getNombre))
            .map(entity -> new IncidentStatusResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion()
            ))
            .toList();
    }

    private void validateOwnerRequest(CreateIncidentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            throw new AccessDeniedException("No autorizado para crear incidentes");
        }

        boolean isUsuario = authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_USUARIO".equals(authority.getAuthority()));

        if (!isUsuario) {
            return;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthenticatedUser authenticatedUser)) {
            throw new AccessDeniedException("No fue posible identificar al usuario autenticado");
        }

        Long authUserId = authenticatedUser.id();

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug(
                "Owner validation authenticatedId={} requestId={}",
                authUserId,
                request.idUsuario()
            );
        }

        if (!Objects.equals(authUserId, request.idUsuario())) {
            throw new AccessDeniedException("No tienes permiso para crear incidentes para otro usuario");
        }
    }

    private IncidentEntity findIncident(Long id) {
        return incidentRepository.findById(id)
            .orElseThrow(() -> new IncidentNotFoundException("Incidente no encontrado"));
    }

    private void validateOwnerIncidentAccess(IncidentEntity incident) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            throw new AccessDeniedException("No autorizado para consultar este incidente");
        }

        boolean isUsuario = authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_USUARIO".equals(authority.getAuthority()));

        if (!isUsuario) {
            return;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof AuthenticatedUser authenticatedUser) || authenticatedUser.id() == null) {
            throw new AccessDeniedException("No fue posible identificar al usuario autenticado");
        }

        if (!Objects.equals(authenticatedUser.id(), incident.getIdUsuario())) {
            throw new AccessDeniedException("No tienes permiso para consultar este incidente");
        }
    }

    private void saveStatusHistory(
        IncidentEntity incident,
        IncidentStatusEntity status,
        Long idUsuarioResponsable,
        String observacion
    ) {
        IncidentStatusHistoryEntity history = new IncidentStatusHistoryEntity();
        history.setIncidente(incident);
        history.setEstadoIncidente(status);
        history.setIdUsuarioResponsable(idUsuarioResponsable);
        history.setObservacion(observacion);

        incidentStatusHistoryRepository.save(history);
    }

    private IncidentResponse toResponse(IncidentEntity entity) {
        return new IncidentResponse(
            entity.getId(),
            entity.getIdUsuario(),
            entity.getTipoIncidente().getId(),
            entity.getTipoIncidente().getNombre(),
            entity.getEstadoIncidente().getId(),
            entity.getEstadoIncidente().getNombre(),
            entity.getDescripcion(),
            entity.getLatitud(),
            entity.getLongitud(),
            entity.getDireccionReferencia(),
            entity.getFechaReporte(),
            entity.getFechaActualizacion()
        );
    }

    private IncidentStatusHistoryResponse toHistoryResponse(IncidentStatusHistoryEntity entity) {
        return new IncidentStatusHistoryResponse(
            entity.getId(),
            entity.getIncidente().getId(),
            entity.getEstadoIncidente().getId(),
            entity.getEstadoIncidente().getNombre(),
            entity.getIdUsuarioResponsable(),
            entity.getObservacion(),
            entity.getFechaCambio()
        );
    }

    private EvidenceResponse toEvidenceResponse(IncidentEvidenceEntity entity) {
        return new EvidenceResponse(
            entity.getId(),
            entity.getIncidente().getId(),
            entity.getTipoArchivo(),
            entity.getUrlArchivo(),
            entity.getNombreArchivo(),
            entity.getFechaCarga()
        );
    }
}
