---
title: "Neversion"
tag: "Proyecto personal"
summary: "SaaS de reventa de credenciales digitales diseñado con arquitectura hexagonal, multi-tenancy y despliegue automatizado en Dokploy."
role: "Fundador y desarrollador único"
stack: ["Java", "Spring Framework + Hexagonal Architecture + DDD", "Angular 17", "Docker", "CI con GitHub Actions", "Dokploy", "PostgreSQL", "Supabase Auth & Storage", "gRPC (Bun)"]
highlights: [
  "Diseñé e implementé la arquitectura hexagonal (Ports & Adapters) y DDD (Domain-Driven Design) en la Spring Boot App, aislando completamente las reglas de negocio de los detalles de infraestructura.",
  "Desarrollé dos aplicaciones frontend, la tienda y un panel administrativo usando Angular 17 y standalone components, aplicando Signals para manejar de manera reactiva y eficiente el estado global sin depender de flujos RxJS complejos.",
  "Construí un microservicio ligero de notificaciones usando Bun y gRPC, integrando SQLite para almacenamiento local y optimizando el uso de la memoria RAM en el servidor.",
  "Desplegué la infraestructura multi-tenant con Dokploy, segmentando el tráfico en redes independientes (comunicación interna aislada vs red pública gestionada por Traefik)."
]
githubUrl: null
liveUrl: null
order: 1
diagramMermaid: |
  graph TD
      subgraph CloudflarePages [Cloudflare Pages]
          Panel[SPA Panel Admin - Angular]
          Store[SPA Storefront - Angular]
      end

      CF[Cloudflare Proxy / WAF]

      subgraph VPS [Servidor VPS]
          subgraph dokploy-net [Red: dokploy-network]
              Traefik[Traefik Proxy]
              API[Spring Boot App]
          end

          subgraph neversion-net [Red: neversion-network]
              API
              DB[(PostgreSQL)]
              Notification[gRPC Notification Service - Bun/SQLite]
              Alloy[Grafana Alloy]
          end
      end

      subgraph Externo [Servicios Externos]
          Auth[Supabase Auth]
          Storage[Supabase Storage]
          Resend[Resend Email API]
      end

      Panel -->|HTTPS| CF
      Store -->|HTTPS| CF
      CF -->|HTTPS| Traefik
      Traefik -->|HTTP| API
      
      Panel -->|HTTPS| Auth
      Store -->|HTTPS| Auth
      API -->|HTTPS| Auth
      
      Panel -->|HTTPS| Storage
      Store -->|HTTPS| Storage
      
      API -->|JDBC| DB
      API -->|gRPC| Notification
      Notification -->|HTTPS| Resend
      Alloy -->|HTTPS| Cloud[Grafana Cloud]
---

Neversion nació como un proyecto orientado a resolver una necesidad de negocio real, teniendo como meta principal construir un producto totalmente funcional y poner en práctica conocimientos avanzados sobre Docker y la orquestación de contenedores.

El sistema surgió originalmente para automatizar la operación diaria de un negocio de servicios digitales que dependía críticamente de WhatsApp, hojas de cálculo manuales en Excel y revisiones diarias propensas a errores para evitar la suspensión del servicio. La solución requería un canal de venta directo y panel de cara al cliente (evitando cuellos de botella por chat) y un centro de control operativo ágil para la asignación semiautomática de credenciales, gestión de perfiles y seguimiento automatizado de expiraciones.
