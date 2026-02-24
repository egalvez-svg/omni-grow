import { MigrationInterface, QueryRunner } from 'typeorm'

export class CultivationLifecycleUpdate1769600000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Crear tabla fases_cultivo
        await queryRunner.query(`
      CREATE TABLE "fases_cultivo" (
        "id" SERIAL PRIMARY KEY,
        "nombre" varchar(50) NOT NULL UNIQUE,
        "slug" varchar(50) NOT NULL UNIQUE,
        "descripcion" text,
        "activo" boolean NOT NULL DEFAULT true
      )
    `)

        // 2. Insertar fases iniciales
        await queryRunner.query(`
      INSERT INTO "fases_cultivo" ("nombre", "slug", "descripcion") VALUES
      ('Semilla', 'semilla', 'Etapa inicial desde la germinación'),
      ('Esqueje', 'esqueje', 'Etapa de enraizamiento de clones'),
      ('Vegetativo', 'vegetativo', 'Crecimiento estructural de la planta'),
      ('Pre-floración', 'pre-floracion', 'Transición al ciclo reproductivo'),
      ('Floración', 'floracion', 'Desarrollo de flores/frutos'),
      ('Cosecha', 'cosecha', 'Etapa final de recolección'),
      ('Finalizado', 'finalizado', 'Cultivo concluido')
    `)

        // 3. Añadir columna faseId a cultivos
        await queryRunner.query(`ALTER TABLE "cultivos" ADD "faseId" integer`)

        // 4. Crear tabla cultivos_fases_historial
        await queryRunner.query(`
      CREATE TABLE "cultivos_fases_historial" (
        "id" SERIAL PRIMARY KEY,
        "cultivoId" integer NOT NULL,
        "faseId" integer NOT NULL,
        "fecha_inicio" TIMESTAMP NOT NULL DEFAULT now(),
        "fecha_fin" TIMESTAMP,
        "notas" text,
        CONSTRAINT "FK_cultivo_historial" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_fase_historial" FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id")
      )
    `)

        // 5. Añadir columna faseHistorialId a nutricion_semanal
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" ADD "faseHistorialId" integer`)
        await queryRunner.query(`
      ALTER TABLE "nutricion_semanal" 
      ADD CONSTRAINT "FK_nutricion_fase_historial" 
      FOREIGN KEY ("faseHistorialId") REFERENCES "cultivos_fases_historial"("id")
    `)

        // 6. Migrar datos existentes y crear historial inicial
        // Mapear estado enum actual a IDs de fases_cultivo
        const cultivos = await queryRunner.query(`SELECT id, estado, fecha_inicio FROM "cultivos"`)
        const fases = await queryRunner.query(`SELECT id, slug FROM "fases_cultivo"`)

        const faseMap = {}
        fases.forEach(f => { faseMap[f.slug] = f.id })

        for (const cultivo of cultivos) {
            const faseId = faseMap[cultivo.estado] || faseMap['vegetativo']

            // Actualizar cultivo
            await queryRunner.query(`UPDATE "cultivos" SET "faseId" = $1 WHERE id = $2`, [faseId, cultivo.id])

            // Crear registro en historial
            await queryRunner.query(
                `INSERT INTO "cultivos_fases_historial" ("cultivoId", "faseId", "fecha_inicio") VALUES ($1, $2, $3)`,
                [cultivo.id, faseId, cultivo.fecha_inicio || new Date()]
            )
        }

        // 7. Establecer faseId como NOT NULL después de la migración (y FK)
        await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "faseId" SET NOT NULL`)
        await queryRunner.query(`
      ALTER TABLE "cultivos" 
      ADD CONSTRAINT "FK_cultivo_fase_actual" 
      FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id")
    `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_cultivo_fase_actual"`)
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_nutricion_fase_historial"`)
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP COLUMN "faseHistorialId"`)
        await queryRunner.query(`DROP TABLE "cultivos_fases_historial"`)
        await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "faseId"`)
        await queryRunner.query(`DROP TABLE "fases_cultivo"`)
    }
}
