# Guía de Configuración TypeORM y Migraciones

## 📁 Estructura de Archivos

```
src/
├── config/
│   ├── typeorm.config.ts       # ⭐ Configuración compartida
│   ├── data-source.ts          # 🔧 Para CLI de migraciones
│   └── database.config.ts      # 🚀 Para NestJS app
└── database/
    └── migrations/
        └── *.ts                # 📄 Archivos de migración
```

---

## ¿Por qué 3 archivos de configuración?

### 1️⃣ `typeorm.config.ts` - Configuración Compartida
**Propósito**: Evitar duplicación de código

```typescript
export const getTypeOrmConfig = (forCli = false): DataSourceOptions => {
  // Configuración única que usan ambos contextos
}
```

**Ventajas**:
- ✅ Una sola fuente de verdad
- ✅ Sin duplicación de código
- ✅ Cambios se aplican automáticamente a ambos contextos

---

### 2️⃣ `data-source.ts` - Para CLI TypeORM
**Propósito**: Ejecutar comandos de migración desde la terminal

**Cuándo se usa**:
```bash
npm run migration:generate src/database/migrations/MiMigracion
npm run migration:run
npm run migration:revert
```

**Por qué es necesario**:
- El CLI de TypeORM necesita una instancia de `DataSource`
- Se ejecuta **fuera del contexto de NestJS**
- No puede usar `registerAs()` de NestJS

---

### 3️⃣ `database.config.ts` - Para NestJS
**Propósito**: Configuración para la aplicación NestJS

**Cuándo se usa**:
```bash
npm run start:dev
npm run start:prod
```

**Por qué es diferente**:
- Usa `registerAs()` para integrarse con NestJS Config
- Se carga cuando la app inicia
- Incluye `autoLoadEntities: true` (específico de NestJS)

---

## 📝 Comandos Disponibles en package.json

```json
{
  "scripts": {
    // Generar migración automáticamente (compara entidades vs BD)
    "migration:generate": "npx typeorm-ts-node-commonjs migration:generate -d src/config/data-source.ts",
    
    // Crear migración vacía (para escribir SQL manualmente)
    "migration:create": "npx typeorm-ts-node-commonjs migration:create",
    
    // Ejecutar migraciones pendientes
    "migration:run": "npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts",
    
    // Revertir última migración
    "migration:revert": "npx typeorm-ts-node-commonjs migration:revert -d src/config/data-source.ts",
    
    // Ver estado de migraciones
    "migration:show": "npx typeorm-ts-node-commonjs migration:show -d src/config/data-source.ts"
  }
}
```

---

## 🚀 Flujo de Trabajo para Agregar un Campo

### Ejemplo: Agregar `anioId` a `dispositivos`

#### **Paso 1:** Modificar la entidad

```typescript
// src/dispositivos/entities/dispositivo.entity.ts
@Entity('dispositivos')
export class Dispositivo {
  // ... campos existentes
  
  @Column({ nullable: true })
  anioId?: number
  
  @ManyToOne(() => Anio, { nullable: true })
  @JoinColumn({ name: 'anioId' })
  anio?: Anio
}
```

#### **Paso 2:** Generar migración

```bash
npm run migration:generate src/database/migrations/AddAnioToDispositivo
```

Esto creará: `src/database/migrations/1732620000000-AddAnioToDispositivo.ts`

#### **Paso 3:** Revisar la migración generada

```typescript
export class AddAnioToDispositivo1732620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica que el SQL generado sea correcto
    await queryRunner.query(`ALTER TABLE dispositivos ADD anioId int NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE dispositivos DROP COLUMN anioId`)
  }
}
```

#### **Paso 4:** Ejecutar migración

```bash
npm run migration:run
```

#### **Paso 5 (opcional):** Si algo sale mal, revertir

```bash
npm run migration:revert
```

---

## 🔄 Diferencias Clave: CLI vs App

| Aspecto | CLI (`data-source.ts`) | App (`database.config.ts`) |
|---------|------------------------|----------------------------|
| **Archivos de entidades** | `src/**/*.entity.ts` | `dist/**/*.entity.js` |
| **Archivos de migraciones** | `src/database/migrations/*.ts` | `dist/database/migrations/*.js` |
| **Logging** | `true` (ver SQL) | `false` (usar logger file) |
| **AutoLoadEntities** | ❌ No disponible | ✅ Sí (NestJS feature) |
| **Contexto** | Línea de comandos | Aplicación en ejecución |

---

## ⚠️ Errores Comunes

### Error: "Entity metadata not found"
**Causa**: El CLI no puede encontrar las entidades
**Solución**: Verifica que `entities: ['src/**/*.entity.ts']` esté en `data-source.ts`

### Error: "Duplicate column name"
**Causa**: La columna ya existe en la BD
**Opciones**:
1. La migración ya se ejecutó antes
2. Tenías `synchronize: true` y TypeORM la creó automáticamente

### Error: "Cannot find module 'data-source.ts'"
**Causa**: El path al data-source es incorrecto
**Solución**: Usar ruta relativa desde la raíz: `src/config/data-source.ts`

---

## 🎯 Mejores Prácticas

1. **Nunca uses `synchronize: true` en producción**
   ```typescript
   synchronize: process.env.NODE_ENV !== 'production' ? false : false
   ```

2. **Siempre revisa las migraciones generadas**
   - TypeORM puede generar SQL innecesario
   - Verifica el orden de las operaciones

3. **Usa nombres descriptivos**
   ```bash
   # ✅ Bueno
   AddAnioIdToDispositivos
   CreateUsersTable
   AddIndexToEmailColumn
   
   # ❌ Malo
   Migration1
   Update
   Fix
   ```

4. **Haz backup antes de ejecutar en producción**
   ```bash
   # Siempre prueba primero en desarrollo
   npm run migration:run
   ```

5. **Mantén las migraciones en el repositorio**
   - Son parte del código
   - Versionan los cambios de la BD

---

## 📚 Comandos de Referencia Rápida

```bash
# Generar migración (compara código vs BD)
npm run migration:generate src/database/migrations/NombreMigracion

# Crear migración vacía
npm run migration:create src/database/migrations/NombreMigracion

# Ver migraciones pendientes
npm run migration:show

# Ejecutar todas las migraciones pendientesnpm run migration:run

# Revertir UNA migración
npm run migration:revert
```

---

## ✅ Resumen

- **`typeorm.config.ts`** = Configuración compartida (DRY principle)
- **`data-source.ts`** = Para comandos CLI de migraciones
- **`database.config.ts`** = Para la aplicación NestJS
- **Los 3 son necesarios** porque trabajan en contextos diferentes
- **Una sola fuente de verdad** gracias a la configuración compartida
