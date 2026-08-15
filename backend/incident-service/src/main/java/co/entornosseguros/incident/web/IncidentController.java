package co.entornosseguros.incident.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.entornosseguros.incident.service.IncidentService;
import co.entornosseguros.incident.web.dto.ChangeIncidentStatusRequest;
import co.entornosseguros.incident.web.dto.CreateEvidenceRequest;
import co.entornosseguros.incident.web.dto.CreateIncidentRequest;
import co.entornosseguros.incident.web.dto.EvidenceResponse;
import co.entornosseguros.incident.web.dto.IncidentResponse;
import co.entornosseguros.incident.web.dto.IncidentStatusHistoryResponse;
import co.entornosseguros.incident.web.dto.IncidentStatusResponse;
import co.entornosseguros.incident.web.dto.IncidentTypeResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<IncidentResponse> getAll(@RequestParam(name = "idUsuario", required = false) Long idUsuario) {
        return incidentService.getIncidents(idUsuario);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse create(@Valid @RequestBody CreateIncidentRequest request) {
        return incidentService.createIncident(request);
    }

    @GetMapping("/{id}")
    public IncidentResponse getById(@PathVariable Long id) {
        return incidentService.getById(id);
    }

    @GetMapping("/{id}/history")
    public List<IncidentStatusHistoryResponse> history(@PathVariable Long id) {
        return incidentService.getHistory(id);
    }

    @GetMapping("/{id}/evidences")
    public List<EvidenceResponse> evidence(@PathVariable Long id) {
        return incidentService.getEvidence(id);
    }

    @PostMapping("/{id}/evidences")
    @ResponseStatus(HttpStatus.CREATED)
    public EvidenceResponse addEvidence(@PathVariable Long id, @Valid @RequestBody CreateEvidenceRequest request) {
        return incidentService.addEvidence(id, request);
    }

    @PatchMapping("/{id}/status")
    public IncidentResponse changeStatus(@PathVariable Long id, @Valid @RequestBody ChangeIncidentStatusRequest request) {
        return incidentService.changeStatus(id, request);
    }

    @GetMapping("/catalogs/types")
    public List<IncidentTypeResponse> incidentTypes() {
        return incidentService.getIncidentTypes();
    }

    @GetMapping("/catalogs/statuses")
    public List<IncidentStatusResponse> incidentStatuses() {
        return incidentService.getIncidentStatuses();
    }
}
