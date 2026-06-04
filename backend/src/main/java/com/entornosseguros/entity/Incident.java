package com.entornosseguros.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 
 */
@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incidents_location", columnList = "latitude,longitude"),
    @Index(name = "idx_incidents_status_id", columnList = "status_id"),
    @Index(name = "idx_incidents_report_date", columnList = "report_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 8)
    private Double latitude;
    
    @Column(nullable = false, precision = 11, scale = 8)
    private Double longitude;
    
    @Column(length = 255)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "incident_type_id", nullable = false)
    private IncidentType incidentType;
    
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "priority_id", nullable = false)
    private PriorityLevel priority;
    
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;
    
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    @Column(name = "is_anonymous")
    @Builder.Default
    private Boolean isAnonymous = false;
    
    @Column(name = "report_date")
    @CreationTimestamp
    private LocalDateTime reportDate;
    
    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;
    
    @Column(name = "evidence_count")
    @Builder.Default
    private Integer evidenceCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
