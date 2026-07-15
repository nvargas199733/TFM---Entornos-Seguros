package co.entornosseguros.auth.web;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.entornosseguros.auth.domain.CaiEntity;
import co.entornosseguros.auth.service.CaiService;
import co.entornosseguros.auth.web.dto.CaiResponse;

@RestController
@RequestMapping("/api/v1/cai")
public class CaiController {

    private final CaiService caiService;

    public CaiController(CaiService caiService) {
        this.caiService = caiService;
    }

    @GetMapping
    public List<CaiResponse> getAll() {
        return caiService.getAllActive()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    public CaiResponse getById(@PathVariable Long id) {
        CaiEntity cai = caiService.getById(id);
        if (cai == null) {
            throw new IllegalArgumentException("CAI no encontrado");
        }
        return toResponse(cai);
    }

    @GetMapping("/nearest")
    public CaiResponse getNearestCai(
        @RequestParam(name = "lat") Double latitud,
        @RequestParam(name = "lng") Double longitud
    ) {
        CaiEntity cai = caiService.getNearestCai(latitud, longitud);
        if (cai == null) {
            throw new IllegalArgumentException("No se encontró CAI cercano");
        }
        return toResponse(cai);
    }

    private CaiResponse toResponse(CaiEntity cai) {
        return new CaiResponse(
            cai.getId(),
            cai.getCodigo(),
            cai.getNombre(),
            cai.getDireccion(),
            cai.getTelefono(),
            cai.getLocalidad(),
            cai.getLatitud(),
            cai.getLongitud(),
            cai.getActivo()
        );
    }
}
