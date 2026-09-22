---
title: "Neversion"
tag: "Proyecto personal"
summary: "Plataforma SaaS orientada al control de reventa de streaming construida con arquitectura hexagonal en Spring Boot 4, frontends en Angular 21 y React 19, borde serverless en Cloudflare Workers e infraestructura AWS Graviton con Terraform."
role: "Fundador y desarrollador único"
stack: [
  "Java 21",
  "Spring Boot 4",
  "Arquitectura Hexagonal",
  "Domain-Driven Design (DDD)",
  "Spring Security",
  "Angular 21 (Signals)",
  "React 19",
  "TypeScript",
  "Cloudflare Workers",
  "AWS (EC2 Graviton, ECR, S3, IAM, SSM)",
  "Terraform",
  "GitHub Actions (CI/CD, OIDC)",
  "Docker (Multi-stage, Multi-arch)",
  "Trivy",
  "PostgreSQL 17",
  "Flyway",
  "Supabase"
]
highlights: [
  "Implementé servicios serverless perimetrales (Cloudflare Workers) como API Gateway de entrada para validación de JWT, rate limiting, transformación de respuestas (view models), procesamiento reactivo a webhooks de base de datos y tareas programadas (crons), optimizando latencia y costos operativos.",
  "Diseñé la arquitectura hexagonal del backend desacoplando módulos de negocio mediante principios de Domain-Driven Design (DDD), lenguaje ubicuo, 12 épicas y 72 historias de usuario, integrando Spring Security para mecanismos robustos de autenticación y autorización.",
  "Diseñé la infraestructura en AWS aprovisionada con Terraform bajo enfoque serverless-first, prescindiendo de IPv4 pública y adoptando conectividad IPv6 para reducir la superficie de ataque y costos, seleccionando estratégicamente la región US-West para minimizar latencia hacia PostgreSQL.",
  "Diseñé una estrategia Docker multi-stage con --platform=$BUILDPLATFORM, compilando Java en x86_64 para acelerar el CI y empaquetando para AWS Graviton/ARM64 con usuario no-root, optimización JVM contra OOM y despliegues automáticos vía AWS SSM con autenticación OIDC libre de secretos estáticos.",
  "Diseñé la persistencia en PostgreSQL 17 con migraciones de esquema versionadas en Flyway y políticas RLS; evalué conscientemente abstracciones de JPA/Hibernate para prevenir consultas N+1 y determiné posponer la incorporación de Redis al evaluar que la concurrencia actual no justificaba su costo operativo.",
  "Desarrollé aplicaciones web en un monorepo modular con Angular 21 (Signals) para el panel administrativo y React 19 para la tienda, consumiendo SDKs tipados generados automáticamente desde contratos OpenAPI publicados en GitHub Packages.",
  "Optimicé el pipeline de GitHub Actions mediante caché de dependencias, paralelización de jobs, escaneo automatizado de vulnerabilidades y CVEs con Trivy, y adopté flujos de Git estructurados con branches por feature, Pull Requests protegidos y Git worktrees."
]
githubUrl: null
liveUrl: null
order: 1
diagramMermaid: |
  graph TD
      subgraph EdgeLayer ["🌐 Borde & Frontends"]
          Panel["🖥️ Panel Admin (Angular 21 - Signals)"]
          Store["🛒 Storefront (React 19)"]
          CF["⚡ Cloudflare Workers (API Gateway)\nJWT · Rate Limiting · Crons · Webhooks"]
      end

      subgraph AWS ["☁️ AWS Cloud (US-West · IPv6 Only)"]
          subgraph EC2 ["EC2 Graviton / ARM64"]
              API["☕ Core API (Spring Boot 4)\nHexagonal · DDD · Spring Security"]
              SSM["🔐 SSM Parameter Store\nSecretos & Configuración Central"]
          end
          ECR["📦 Amazon ECR\nDocker Multi-arch Images"]
      end

      subgraph Persistence ["🗄️ Persistencia & Integraciones"]
          DB[("🐘 PostgreSQL 17\nFlyway · RLS")]
          Supa["⚡ Supabase Auth & Storage"]
          Actions["🐙 GitHub Actions CI/CD\nOIDC Keyless · Trivy Scan"]
      end

      Panel -->|HTTPS| CF
      Store -->|HTTPS| CF
      CF -->|IPv6 Private Route| API
      API -->|JDBC / JPA| DB
      API -.->|SSM Fetch| SSM
      Panel & Store -->|Auth / Storage| Supa
      API -->|Validar JWT / Webhooks| Supa
      Actions -->|OIDC Deploy| EC2
      Actions -->|Push Image| ECR
---

Neversion nació como un proyecto SaaS orientado a resolver una necesidad de negocio real: automatizar la gestión y el control operativo en la reventa de credenciales de servicios digitales, eliminando cuellos de botella generados por la atención manual en hojas de cálculo y canales de mensajería.

La solución articula una arquitectura completamente desacoplada y moderna: un monorepo con aplicaciones web especializadas (panel administrativo reactivo en Angular 21 con Signals y tienda para clientes en React 19) consumiendo clientes SDK tipados derivados de especificaciones OpenAPI, una capa de borde serverless en Cloudflare Workers para inspección temprana y reducción de latencia, y un backend central en Spring Boot 4 implementado con arquitectura hexagonal y Domain-Driven Design (DDD). La infraestructura cloud opera sobre instancias eficientes AWS Graviton (ARM64) aprovisionadas de forma declarativa con Terraform, prescindiendo de direcciones IPv4 públicas para mitigar vectores de exposición y reducir costos de infraestructura.
