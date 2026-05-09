// Archivo: src/main/java/com/entornosseguros/EntornosSeurosBogotaApplication.java
package com.entornosseguros;

import javafx.application.Application;
import javafx.stage.Stage;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;

/**
 *   Entornos Seguros Bogotá
 *
 *   @author Natalia Vargas R.
 *   @version 1.0.0
 *   @since 2026-01-15
 */
@SpringBootApplication
public class EntornosSeurosBogotaApplication extends Application {

    private ApplicationContext applicationContext;

    @Override
    public void start(Stage primaryStage) throws Exception {
        System.out.println("Iniciando aplicación JavaFX...");

        // Levantar contexto Spring (backend) para inyectar dependencias si se requiere
        this.applicationContext = new SpringApplicationBuilder(EntornosSeurosBogotaApplication.class)
                .headless(false)
                .web(WebApplicationType.NONE)
                .run();

        // Cargar interfaz JavaFX (FXML) y permitir que los controladores sean beans de Spring
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/main.fxml"));
        // Usar el ApplicationContext para crear controladores (inyección de dependencias)
        loader.setControllerFactory(applicationContext::getBean);

        Parent root = loader.load();

        primaryStage.setTitle("Entornos Seguros Bogotá");
        primaryStage.setScene(new Scene(root, 1200, 800));
        primaryStage.setMinWidth(800);
        primaryStage.setMinHeight(600);

        primaryStage.show();
        System.out.println("✅ Aplicación JavaFX iniciada correctamente");
    }

    @Override
    public void stop() throws Exception {
        super.stop();
        if (applicationContext != null && applicationContext instanceof ConfigurableApplicationContext) {
            ((ConfigurableApplicationContext) applicationContext).close();
        }
        System.out.println("❌ Aplicación cerrada");
    }

    public static void main(String[] args) {
        launch(args);
    }
}
