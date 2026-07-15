package co.entornosseguros.auth.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.entornosseguros.auth.domain.CaiEntity;

@Repository
public interface CaiRepository extends JpaRepository<CaiEntity, Long> {

    List<CaiEntity> findAllByActivoTrue();

    @Query(
        nativeQuery = true,
        value = "SELECT c.* FROM auth_user.cai c " +
                "WHERE c.activo = true " +
                "ORDER BY ST_Distance(c.geom, ST_Point(:longitud, :latitud)::geography) ASC " +
                "LIMIT 1"
    )
    CaiEntity findNearestActive(@Param("latitud") Double latitud, @Param("longitud") Double longitud);
}
