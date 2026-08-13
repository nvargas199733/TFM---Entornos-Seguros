package co.entornosseguros.incident.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "historial_estado_incidente", schema = "incident")
public class IncidentStatusHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_estado_incidente")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_incidente", nullable = false)
    private IncidentEntity incidente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_estado_incidente", nullable = false)
    private IncidentStatusEntity estadoIncidente;

    @Column(name = "id_usuario_responsable")
    private Long idUsuarioResponsable;

    @Column(name = "observacion", length = 255)
    private String observacion;

    @Column(name = "fecha_cambio", nullable = false)
    private OffsetDateTime fechaCambio;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (fechaCambio == null) {
            fechaCambio = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public IncidentEntity getIncidente() {
        return incidente;
    }

    public void setIncidente(IncidentEntity incidente) {
        this.incidente = incidente;
    }

    public IncidentStatusEntity getEstadoIncidente() {
        return estadoIncidente;
    }

    public void setEstadoIncidente(IncidentStatusEntity estadoIncidente) {
        this.estadoIncidente = estadoIncidente;
    }

    public Long getIdUsuarioResponsable() {
        return idUsuarioResponsable;
    }

    public void setIdUsuarioResponsable(Long idUsuarioResponsable) {
        this.idUsuarioResponsable = idUsuarioResponsable;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public OffsetDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(OffsetDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
