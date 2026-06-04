# Project Tree Structure

```
EntornosSeurosBogota/
│
├── backend/                          # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/com/entornosseguros/
│   │   │   ├── api/                    # Configuración de API
│   │   │   ├── config/                 # Configuración global
│   │   │   ├── controller/             # Controladores REST
│   │   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── entity/                 # Entidades JPA
│   │   │   ├── exception/              # Excepciones
│   │   │   ├── repository/             # JPA Repositories
│   │   │   ├── security/               # JWT + Seguridad
│   │   │   ├── service/                # Lógica de negocio
│   │   │   ├── websocket/              # WebSocket handlers
│   │   │   └── EntornosSeurosBogotaApplication.java
│   │   ├── resources/
│   │   │   ├── application.properties   # Config principal
│   │   │   ├── application-dev.properties
│   │   │   ├── application-prod.properties
│   │   │   └── db/migration/           # Scripts SQL (Flyway)
│   │   └── test/
│   ├── pom.xml                         # Maven config
│   ├── Dockerfile
│   └── /logs
│
├──  frontend/                        # JavaFX Desktop Application
│   ├── src/
│   │   ├── main/java/com/entornosseguros/
│   │   │   ├── app/                    # Main application
│   │   │   ├── controller/             # FXML controllers
│   │   │   ├── model/                  # Data models
│   │   │   ├── service/                # API & WebSocket clients
│   │   │   ├── ui/
│   │   │   │   ├── components/         # Reusable components
│   │   │   │   ├── scenes/             # Main scenes
│   │   │   │   ├── styles/             # Theme management
│   │   │   │   └── utils/              # UI utilities
│   │   │   └── EntornosSeurosBogotaApplication.java
│   │   ├── resources/
│   │   │   ├── css/                    # Stylesheets
│   │   │   ├── fxml/                   # FXML layouts
│   │   │   ├── images/                 # Images & backgrounds
│   │   │   └── icons/                  # SVG/PNG icons
│   │   └── test/
│   ├── pom.xml                         # Maven config
│   └── build.gradle (opcional)
│
├──  database/
│   ├── schema/
│   │   └── schema.sql                  # Schema inicial
│   ├── migrations/
│   │   ├── V1__Initial_Schema.sql
│   │   └── V2__Insert_Initial_Data.sql
│   └── scripts/
│       └── seed_data.sql               # Datos iniciales
│
├──  docs/
│   ├── SETUP.md                        # Guía de instalación
│   ├── ARCHITECTURE.md                 # Diseño del sistema
│   ├── DATABASE.md                     # Esquema de BD
│   ├── API.md                          # Documentación REST
│   ├── UI_UX.md                        # Guía de diseño
│   └── [otros.md]
│
├──  config/
│   └── [archivos ]
│
├──  .github/
│   └── workflows/
│       ├── ci-cd.yml                   # Pipeline CI/CD
│       ├── test.yml
│       └── deploy.yml
│
├── docker-compose.yml                  # Servicios
├── .env.example                        # Variables de entorno
├── .gitignore
├── README.md                           # Documentación principal
├── CONTRIBUTING.md                     # Guía de contribución
├── LICENSE                             # Licencia MIT
└── PROJECT_STRUCTURE.md                # Este archivo
```


### Backend Structure
```
backend/
├── pom.xml (Maven dependencies)
│
├── src/main/java/com/entornosseguros/
│   │
│   ├── api/
│   │   ├── ApiConfig.java
│   │   └── ApiVersion.java
│   │
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── WebSocketConfig.java
│   │   ├── CorsConfig.java
│   │   ├── CacheConfig.java
│   │   └── JpaAuditingConfig.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── IncidentController.java
│   │   ├── UserController.java
│   │   ├── AnalyticsController.java
│   │   ├── CAIController.java
│   │   └── NotificationController.java
│   │
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── IncidentCreateRequest.java
│   │   │   └── UserCreateRequest.java
│   │   ├── response/
│   │   │   ├── ApiResponse.java
│   │   │   ├── IncidentDTO.java
│   │   │   └── UserDTO.java
│   │   └── mapper/
│   │       └── EntityMapper.java
│   │
│   ├── entity/
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── Incident.java
│   │   ├── IncidentType.java
│   │   ├── PriorityLevel.java
│   │   ├── Status.java
│   │   ├── CAI.java
│   │   ├── Media.java
│   │   ├── Notification.java
│   │   ├── ActivityLog.java
│   │   └── IncidentComment.java
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── UnauthorizedException.java
│   │   └── ValidationException.java
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── RoleRepository.java
│   │   ├── IncidentRepository.java
│   │   ├── CAIRepository.java
│   │   ├── NotificationRepository.java
│   │   └── ActivityLogRepository.java
│   │
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── UserDetailsServiceImpl.java
│   │   ├── SecurityUtil.java
│   │   └── JwtAuthenticationEntryPoint.java
│   │
│   ├── service/
│   │   ├── IncidentService.java
│   │   ├── UserService.java
│   │   ├── NotificationService.java
│   │   ├── AnalyticsService.java
│   │   ├── AuthService.java
│   │   ├── EmailService.java
│   │   ├── GeoLocationService.java
│   │   └── AuditService.java
│   │
│   ├── websocket/
│   │   ├── WebSocketConfig.java
│   │   ├── StompController.java
│   │   ├── IncidentWebSocketService.java
│   │   └── NotificationBroadcaster.java
│   │
│   └── EntornosSeurosBogotaApplication.java
│
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-prod.properties
│   ├── application-test.properties
│   ├── logback-spring.xml
│   └── db/migration/
│       ├── V1__Initial_Schema.sql
│       ├── V2__Insert_Initial_Data.sql
│       └── V3__Add_...sql
│
├── src/test/java/com/entornosseguros/
│   ├── controller/
│   │   ├── AuthControllerTest.java
│   │   └── IncidentControllerTest.java
│   ├── service/
│   │   ├── IncidentServiceTest.java
│   │   └── UserServiceTest.java
│   └── repository/
│       └── IncidentRepositoryTest.java
│
├── pom.xml
└── Dockerfile
```

### Frontend Structure
```
frontend/
├── pom.xml
│
├── src/main/java/com/entornosseguros/
│   │
│   ├── app/
│   │   ├── EntornosSeurosBogotaApplication.java
│   │   ├── AppConfig.java
│   │   └── SceneManager.java
│   │
│   ├── controller/
│   │   ├── LoginController.java
│   │   ├── DashboardController.java
│   │   ├── IncidentController.java
│   │   ├── MapController.java
│   │   ├── AnalyticsController.java
│   │   ├── SettingsController.java
│   │   └── UserManagementController.java
│   │
│   ├── model/
│   │   ├── User.java
│   │   ├── Incident.java
│   │   ├── CAI.java
│   │   ├── Notification.java
│   │   └── AnalyticsData.java
│   │
│   ├── service/
│   │   ├── ApiService.java
│   │   ├── WebSocketService.java
│   │   ├── AuthService.java
│   │   ├── CacheService.java
│   │   ├── NotificationService.java
│   │   └── GeoService.java
│   │
│   └── ui/
│       ├── components/
│       │   ├── HeaderBar.java
│       │   ├── Sidebar.java
│       │   ├── IncidentCard.java
│       │   ├── MapPane.java
│       │   ├── StatsPanel.java
│       │   ├── LoadingSpinner.java
│       │   └── NotificationAlert.java
│       │
│       ├── scenes/
│       │   ├── LoginScene.java
│       │   ├── MainScene.java
│       │   ├── DashboardScene.java
│       │   ├── MapScene.java
│       │   ├── ReportIncidentScene.java
│       │   ├── IncidentDetailScene.java
│       │   ├── AnalyticsScene.java
│       │   ├── UserManagementScene.java
│       │   └── SettingsScene.java
│       │
│       ├── styles/
│       │   ├── ThemeManager.java
│       │   ├── StyleConstants.java
│       │   └── ColorPalette.java
│       │
│       └── utils/
│           ├── UIUtil.java
│           ├── AnimationUtil.java
│           ├── DialogUtil.java
│           ├── FormatUtil.java
│           └── DateTimeUtil.java
│
├── src/main/resources/
│   ├── css/
│   │   ├── styles.css
│   │   ├── dark-mode.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   ├── fxml/
│   │   ├── main.fxml
│   │   ├── login.fxml
│   │   ├── dashboard.fxml
│   │   ├── map.fxml
│   │   ├── report-incident.fxml
│   │   ├── incident-detail.fxml
│   │   ├── analytics.fxml
│   │   ├── user-management.fxml
│   │   └── settings.fxml
│   │
│   ├── images/
│   │   ├── logo.png
│   │   ├── header-background.jpg
│   │   ├── bogota-map.png
│   │   └── [otros.png]
│   │
│   └── icons/
│       ├── incident-robo.svg
│       ├── incident-hurto.svg
│       ├── location-pin.svg
│       ├── menu.svg
│       ├── search.svg
│       └── [otros.svg]
│
├── src/test/java/com/entornosseguros/
│   ├── controller/
│   │   ├── LoginControllerTest.java
│   │   └── MapControllerTest.java
│   ├── service/
│   │   ├── ApiServiceTest.java
│   │   └── AuthServiceTest.java
│   └── ui/
│       └── ComponentsTest.java
│
└── pom.xml
```



