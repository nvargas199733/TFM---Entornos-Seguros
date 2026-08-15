package co.entornosseguros.policereport.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.entornosseguros.policereport.service.PoliceReportService;
import co.entornosseguros.policereport.web.dto.CreatePoliceReportRequest;
import co.entornosseguros.policereport.web.dto.PoliceReportResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/police-reports")
public class PoliceReportController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PoliceReportController.class);

    private final PoliceReportService policeReportService;

    public PoliceReportController(PoliceReportService policeReportService) {
        this.policeReportService = policeReportService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PoliceReportResponse create(@Valid @RequestBody CreatePoliceReportRequest request) {
        LOGGER.debug("POST /api/v1/police-reports enteredController=true requestPoliceId={}", request.idUsuarioPolicia());
        return policeReportService.create(request);
    }

    @GetMapping("/{id}")
    public PoliceReportResponse getById(@PathVariable Long id) {
        return policeReportService.getById(id);
    }

    @GetMapping("/by-incident/{idIncidente}")
    public List<PoliceReportResponse> getByIncident(@PathVariable Long idIncidente) {
        return policeReportService.getByIncident(idIncidente);
    }
}