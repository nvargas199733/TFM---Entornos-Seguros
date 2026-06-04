package com.entornosseguros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ✅ Entornos Seguros Bogotá - Aplicación Principal
 * 
 * Sistema inteligente de reportes de seguridad ciudadana en tiempo real
 * 
 * @author Equipo de Desarrollo - Secretaría Distrital de Seguridad
 * @version 1.0.0
 * @since 2026-01-15
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableScheduling
@EnableAsync
public class EntornosSeurosBogotaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EntornosSeurosBogotaApplication.class, args);
        
        System.out.println("\n");
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║         🛡️  ENTORNOS SEGUROS BOGOTÁ - BACKEND             ║");
        System.out.println("║              Sistema de Reportes en Tiempo Real            ║");
        System.out.println("║                    Versión 1.0.0 - 2026                   ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
        System.out.println("");
        System.out.println("📊 API disponible en: http://localhost:8080/api");
        System.out.println("📚 Documentación: http://localhost:8080/api/swagger-ui.html");
        System.out.println("🔒 Seguridad: JWT + Role-based access control");
        System.out.println("🌐 WebSocket: ws://localhost:8080/api/ws");
        System.out.println("");
        System.out.println("✅ Aplicación iniciada correctamente.");
        System.out.println("");
    }
}
