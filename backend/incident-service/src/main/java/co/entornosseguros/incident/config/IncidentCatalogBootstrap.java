package co.entornosseguros.incident.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import co.entornosseguros.incident.domain.IncidentStatusEntity;
import co.entornosseguros.incident.domain.IncidentTypeEntity;
import co.entornosseguros.incident.repository.IncidentStatusRepository;
import co.entornosseguros.incident.repository.IncidentTypeRepository;

@Configuration
public class IncidentCatalogBootstrap {

    @Bean
    CommandLineRunner seedCatalogs(
        IncidentTypeRepository incidentTypeRepository,
        IncidentStatusRepository incidentStatusRepository
    ) {
        return args -> {
            if (incidentTypeRepository.count() == 0) {
                List<IncidentTypeEntity> types = List.of(
                    type("Emergencia de Seguridad", "Situaciones que ponen en riesgo la seguridad"),
                    type("Robo a persona", "Robo o hurto a personas"),
                    type("Robo de vehículo", "Robo o hurto de vehículo"),
                    type("Robo a casa", "Robo o hurto en viviendas"),
                    type("Actividad sospechosa", "Comportamientos o situaciones inusuales")
                );

                incidentTypeRepository.saveAll(types);
            }

            if (incidentStatusRepository.count() == 0) {
                List<IncidentStatusEntity> statuses = List.of(
                    status("PENDIENTE", "Incidente recibido y pendiente de atención"),
                    status("EN_ATENCION", "Incidente en proceso de atención policial"),
                    status("ATENDIDO", "Incidente atendido por policía"),
                    status("CERRADO", "Incidente cerrado administrativamente")
                );

                incidentStatusRepository.saveAll(statuses);
            }
        };
    }

    private IncidentTypeEntity type(String nombre, String descripcion) {
        IncidentTypeEntity entity = new IncidentTypeEntity();
        entity.setNombre(nombre);
        entity.setDescripcion(descripcion);
        entity.setEstadoActivo(Boolean.TRUE);
        return entity;
    }

    private IncidentStatusEntity status(String nombre, String descripcion) {
        IncidentStatusEntity entity = new IncidentStatusEntity();
        entity.setNombre(nombre);
        entity.setDescripcion(descripcion);
        return entity;
    }
}
