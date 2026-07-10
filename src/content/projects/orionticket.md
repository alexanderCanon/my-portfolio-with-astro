---
title: "OrionTicket"
tag: "Proyecto académico"
summary: "Plataforma multi-tenant de para la venta de boletos de eventos, diseñada con microservicios y enfocada en alta concurrencia."
role: "Desarrollador Backend"
stack: ["Java", "Spring Framework", "RabbitMQ", "Redis", "NoSQL (MongoDB)", "Kubernetes", "PostgreSQL (HA)", "k6", "OpenTelemetry", "Prometheus & Grafana"]
highlights: [
  "Diseñé e implementé la arquitectura de microservicios autónomos utilizando Java 21 y Spring Boot, aislando bases de datos e integrando el patrón CQRS para separar la escritura de la lectura rápida.",
  "Configuré la comunicación asíncrona basada en eventos de dominio utilizando RabbitMQ, con consumidores idempotentes, reintentos y colas DLQ para garantizar consistencia eventual bajo alta carga.",
  "Desarrollé el módulo de control de accesos en tiempo real con semántica 'first-scan-wins', aplicando bloqueos y caché en Redis para prevenir fraude y doble validación de códigos QR.",
  "Orquesté la infraestructura analizando cómo Kubernetes resuelve desafíos críticos de escalamiento horizontal automático, tolerancia a fallos, Service Mesh y balanceo de carga.",
  "Realicé pruebas de estrés y rendimiento utilizando k6 para simular picos de concurrencia y certificar la resiliencia del clúster de base de datos PostgreSQL en alta disponibilidad."
]
githubUrl: null
liveUrl: null
order: 2
diagramMermaid: |
  graph TD
      subgraph Frontends [Capa de Clientes]
          BP[Buyer Portal - Angular]
          OP[Organizer Panel - Angular]
          VA[Validator App - Mobile]
      end

      GW[API Gateway]

      subgraph Cluster [Ecosistema de Microservicios]
          subgraph Core [Servicios de Negocio]
              ID[Identity Service]
              EM[Event Management]
              SI[Seating & Inventory]
              OR[Orders Service]
              PA[Payments Service]
              TI[Ticket Issuance]
              AC[Access Control]
          end

          subgraph Cross [Servicios Cruzados]
              NO[Notifications Service]
              RE[Reporting Service]
          end

          subgraph Databases [Persistencia Independiente]
              DB_SQL[(PostgreSQL por Servicio)]
              DB_NOSQL[(MongoDB - Proyecciones NoSQL)]
              Redis[(Redis - Locks & Caché)]
          end

          Rabbit[(RabbitMQ Message Broker)]
      end

      subgraph Ext [Integraciones Externas]
          PGW[Pasarela de Pagos]
          Email[Resend / Email API]
          Grafana[Grafana Cloud]
      end

      %% Enrutamiento síncrono
      Frontends -->|HTTPS| GW
      GW --> ID & EM & SI & OR & PA & TI & AC & NO & RE

      %% Caché y Concurrencia
      SI <-->|Locks de Asientos| Redis
      AC <-->|Estado de Códigos QR| Redis

      %% Acceso a Datos
      ID & EM & SI & OR & PA & TI & AC & NO -->|JDBC / JPA| DB_SQL
      RE -->|Read Models| DB_NOSQL

      %% Flujo Asíncrono de Eventos
      SI & OR & PA & TI & AC & EM -->|Publicar Eventos de Dominio| Rabbit
      Rabbit -->|Despachar Eventos| NO & RE & TI & SI & OR

      %% Integraciones
      PA --> PGW
      NO --> Email
      Core & Cross -.->|OpenTelemetry| Grafana
---

OrionTicket se concibió como un proyecto educativo de la universidad con el objetivo final de demostrar capacidades avanzadas en alta disponibilidad de bases de datos, resiliencia, alta concurrencia, observabilidad, el patrón CQRS y el uso de tecnologías como Redis, RabbitMQ, k6 y bases de datos NoSQL. Sin embargo, la meta primordial de esta arquitectura distribuida fue comprender a fondo cómo Kubernetes y la orquestación nativa de la nube resuelven los mayores desafíos operativos (escalado dinámico de pods, service discovery interno y auto-recuperación ante fallos del clúster) al desplegar una plataforma de venta de boletos a gran escala. Aún está en fase de desarrollo

