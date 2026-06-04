package com.entornosseguros.repository;

import com.entornosseguros.entity.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio de Incidentes
 * Proporciona acceso a datos de reportes de seguridad
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    
    Page<Incident> findAllByReporterId(Long reporterId, Pageable pageable);
    
    Page<Incident> findAllByStatusId(Long statusId, Pageable pageable);
    
    Page<Incident> findAllByIncidentTypeId(Long typeId, Pageable pageable);
    
    Page<Incident> findAllByPriorityId(Long priorityId, Pageable pageable);
    
    Page<Incident> findAllByAssignedToId(Long assignedToId, Pageable pageable);
    
    @Query("""
        SELECT i FROM Incident i 
        WHERE i.reportDate BETWEEN :startDate AND :endDate
        ORDER BY i.reportDate DESC
    """)
    Page<Incident> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("""
        SELECT i FROM Incident i 
        WHERE (6371000 * acos(cos(radians(:userLat)) * 
               cos(radians(i.latitude)) * cos(radians(i.longitude) - 
               radians(:userLon)) + sin(radians(:userLat)) * 
               sin(radians(i.latitude)))) <= :radiusMeters
        ORDER BY i.reportDate DESC
    """)
    List<Incident> findNearby(
        @Param("userLat") Double userLatitude,
        @Param("userLon") Double userLongitude,
        @Param("radiusMeters") Integer radiusMeters
    );
    
    long countByStatusId(Long statusId);
    
    long countByReportDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
