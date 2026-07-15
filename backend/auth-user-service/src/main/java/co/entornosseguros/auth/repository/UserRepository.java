package co.entornosseguros.auth.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.entornosseguros.auth.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCaseAndIdNot(String correo, Long id);

    boolean existsByCedula(String cedula);

    boolean existsByCedulaAndIdNot(String cedula, Long id);

    Optional<UserEntity> findByCorreoIgnoreCase(String correo);

    List<UserEntity> findAllByActivoTrueOrderByFechaCreacionDesc();
}
