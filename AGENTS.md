# AGENTS.md

Welcome to **Omni Grow**, an advanced climate and cultivation control system. This file provides context and instructions for AI agents like **Jules** to operate within this repository.

## Project Overview
- **Name**: Omni Grow (control-clima)
- **Purpose**: Real-time monitoring and automation of indoor cultivation environments (temperature, humidity, nutrition, sensors, and actuators).
- **Core Architecture**: NestJS (v11+) with TypeScript.

## Technology Stack
- **Backend**: Node.js / NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (TypeORM)
- **Caching**: Redis (ioredis)
- **Communication**: MQTT (for IoT devices)
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Authentication**: JWT & Passport

## Key Project Structure
- `src/actuadores`: Logic for controlling devices (fans, lights, etc.)
- `src/clima`: Climate monitoring and environmental data.
- `src/ia`: AI-driven predictive analysis using Gemini.
- `src/lecturas`: Sensor data ingestion.
- `src/mqtt`: Integration with IoT hardware.
- `src/nutricion`: Irrigation and nutrient tracking.
- `src/reglas`: Automation rules and logic.

## Commands Reference
- **Install dependencies**: `npm install`
- **Start development**: `npm run start:dev`
- **Build**: `npm run build`
- **Linting**: `npm run lint`
- **Migrations**: `npm run migration:generate -- -n Name`, `npm run migration:run`

## Coding Standards
- **Nomenclature**: Use **Conventional Commits** (e.g., `feat:`, `fix:`, `chore:`, `refactor:`).
- **Style**: Prettier and ESLint are enforced.
- **Organization**: Follow NestJS modular patterns. Ensure every new feature has its module, controller, and service.
- **Validation**: Use `class-validator` and DTOs for all incoming request payloads.

## Guidelines for Agents
1. **Always verify migrations**: If modifying the database schema, generate a new migration.
2. **Context Awareness**: Use the `src/ia` module as a reference for AI-related enhancements.
3. **IoT Focus**: Be cautious with `src/gpio` and `src/mqtt` as they interact with hardware.
4. **Security**: Ensure all new endpoints are protected with `JwtAuthGuard` unless explicitly public.
