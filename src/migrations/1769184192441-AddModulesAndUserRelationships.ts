import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModulesAndUserRelationships1769184192441 implements MigrationInterface {
    name = 'AddModulesAndUserRelationships1769184192441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "modulos" ("id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "slug" character varying(50) NOT NULL, "descripcion" text, "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_9dd861f2d25942a1c2c563af058" UNIQUE ("nombre"), CONSTRAINT "UQ_6d68875fb4a2cfbb2216d279568" UNIQUE ("slug"), CONSTRAINT "PK_ba8d97b7acc232a928b1d686c5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario_modulo" ("usuario_id" integer NOT NULL, "modulo_id" integer NOT NULL, CONSTRAINT "PK_8c9cb6605c9598a631ea42c33f7" PRIMARY KEY ("usuario_id", "modulo_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_81d54deb37eba104b27db0f112" ON "usuario_modulo" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_119533f5fce00d45e25e6afe58" ON "usuario_modulo" ("modulo_id") `);
        await queryRunner.query(`ALTER TABLE "usuario_modulo" ADD CONSTRAINT "FK_81d54deb37eba104b27db0f1122" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuario_modulo" ADD CONSTRAINT "FK_119533f5fce00d45e25e6afe587" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Seeding de módulos iniciales
        await queryRunner.query(`INSERT INTO "modulos" ("nombre", "slug", "descripcion") VALUES 
            ('Dispositivos y Sensores', 'dispositivos', 'Acceso a hardware, actuadores y análisis proactivo de IA.'),
            ('IA de Aprendizaje', 'ia_aprendizaje', 'Módulo avanzado de aprendizaje automático basado en comportamiento de cultivos.')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_modulo" DROP CONSTRAINT "FK_119533f5fce00d45e25e6afe587"`);
        await queryRunner.query(`ALTER TABLE "usuario_modulo" DROP CONSTRAINT "FK_81d54deb37eba104b27db0f1122"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_119533f5fce00d45e25e6afe58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_81d54deb37eba104b27db0f112"`);
        await queryRunner.query(`DROP TABLE "usuario_modulo"`);
        await queryRunner.query(`DROP TABLE "modulos"`);
    }

}
