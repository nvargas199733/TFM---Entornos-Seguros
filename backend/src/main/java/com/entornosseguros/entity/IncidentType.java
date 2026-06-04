package com.entornosseguros.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad de Tipo de Incidente
 * Clasificación de incidentes (Robo, Hurto, Vandalismo, etc.)
 */
@Entity
@Table(name = "incident_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 7) // Código hexadecimal de color
    private String color;
    
    @Column(length = 50)
    private String icon;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
