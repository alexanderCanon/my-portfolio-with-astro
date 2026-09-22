---
title: "OrionTicket"
tag: "Proyecto académico"
summary: "Plataforma white-label multi-tenant orientada a eventos, diseñada con arquitectura de microservicios, patrón Transactional Outbox y control de acceso en tiempo real."
role: "Scrum Master & Backend Developer"
stack: [
  "Microservicios",
  "Spring Boot",
  "Spring Cloud Gateway",
  "RabbitMQ",
  "Transactional Outbox",
  "Docker Compose",
  "OpenAPI",
  "Domain-Driven Design (DDD)",
  "Architecture Decision Records (ADR)",
  "Scrum",
  "VPS"
]
highlights: [
  "Fungí como Scrum Master y desarrollador backend, facilitando la organización, planificación y seguimiento del trabajo del equipo bajo Scrum, y registrando decisiones de diseño mediante Architecture Decision Records (ADR).",
  "Diseñé un mecanismo de validación de boletos mediante códigos QR dinámicos con ventana de validez (TTL de 2 minutos) y estrategia first-scan-wins, garantizando control de acceso en tiempo real y prevención de clonación o fraude.",
  "Participé en el diseño de una arquitectura de microservicios multi-tenant, modelando el dominio con 9 bounded contexts, 14 agregados y 47 eventos de dominio para coordinar la integración asíncrona entre módulos de negocio.",
  "Implementé el patrón Transactional Outbox para publicación confiable de eventos hacia RabbitMQ y estructuré APIs REST con OpenAPI generando clientes SDK tipados para desacoplar el consumo interservicios.",
  "Desplegué el ecosistema completo con Spring Cloud Gateway, RabbitMQ y Docker Compose sobre infraestructura de múltiples VPS, configurando pipelines de CI/CD con GitHub Actions."
]
githubUrl: null
liveUrl: null
order: 2
diagramMermaid: |
  graph TD
      subgraph Clients ["📱 Capa de Clientes"]
          BP["Buyer Portal"]
          OP["Organizer Panel"]
          VA["Access Validator App (QR Scan)"]
      end

      GW["🚪 Spring Cloud Gateway\nRuteo dinámico · Inspección perimetral"]

      subgraph Microservices ["⚙️ Ecosistema de Microservicios (Multi-VPS)"]
          subgraph Core ["Servicios de Dominio (9 Bounded Contexts)"]
              ID["Identity Service"]
              EM["Event Management"]
              SI["Seating & Inventory"]
              OR["Orders Service"]
              TI["Ticket Issuance & Validation\n(Dynamic QR · 2-min TTL · First-Scan-Wins)"]
          end

          subgraph Messaging ["Patrón Asíncrono Confiable"]
              Outbox["📦 Transactional Outbox Table"]
              Rabbit["🐇 RabbitMQ Message Broker\nInter-service Events"]
          end

          subgraph Persistence ["🗄️ Persistencia Independiente"]
              DB_SQL[("🐘 PostgreSQL por Servicio")]
          end
      end

      Clients -->|HTTPS| GW
      GW --> Core
      Core -->|Local TX Event Insert| Outbox
      Outbox -->|Reliable Dispatch| Rabbit
      Rabbit -->|Consumo Asíncrono Idempotente| Core
      Core -->|JDBC / JPA| DB_SQL
---

OrionTicket se concibió como un proyecto de equipo universitario orientado a construir una solución robusta y desacoplada para la venta y control de boletos en espectáculos masivos, resolviendo desafíos fundamentales de consistencia eventual, concurrencia y validación antifraude.

El diseño del sistema aborda 9 bounded contexts estructurados bajo principios de Domain-Driven Design (DDD), coordinando el intercambio de estado asíncrono mediante el patrón Transactional Outbox y RabbitMQ. Para la validación presencial, se diseñó un protocolo de códigos QR dinámicos con vigencia temporal estricta (TTL de 2 minutos) y semántica first-scan-wins, impidiendo la duplicidad de accesos. Toda la solución se empaquetó para su orquestación distribuida mediante Docker Compose y Spring Cloud Gateway a través de múltiples entornos VPS.
