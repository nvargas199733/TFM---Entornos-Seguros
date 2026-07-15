package co.entornosseguros.auth.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.entornosseguros.auth.domain.CaiEntity;
import co.entornosseguros.auth.repository.CaiRepository;

@Service
@Transactional(readOnly = true)
public class CaiService {

    private final CaiRepository caiRepository;

    public CaiService(CaiRepository caiRepository) {
        this.caiRepository = caiRepository;
    }

    public List<CaiEntity> getAllActive() {
        return caiRepository.findAllByActivoTrue();
    }

    public CaiEntity getById(Long id) {
        return caiRepository.findById(id).orElse(null);
    }

    public CaiEntity getNearestCai(Double latitud, Double longitud) {
        if (latitud == null || longitud == null) {
            throw new IllegalArgumentException("Latitud y longitud son requeridas");
        }

        return caiRepository.findNearestActive(latitud, longitud);
    }
}
