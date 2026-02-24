import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPestControlAndProductType1771866112266 implements MigrationInterface {
    name = 'AddPestControlAndProductType1771866112266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_nutricion_fase_historial"`);
        await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_cultivo_fase_actual"`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" DROP CONSTRAINT "FK_fase_historial"`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" DROP CONSTRAINT "FK_cultivo_historial"`);
        await queryRunner.query(`CREATE TABLE "productos_tipos" ("id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" text, CONSTRAINT "UQ_2cbcc2ff03f011eb7d6f4696814" UNIQUE ("nombre"), CONSTRAINT "PK_fc2701381b19d252e8fbf7003b9" PRIMARY KEY ("id"))`);

        // Insertar tipos por defecto
        await queryRunner.query(`INSERT INTO "productos_tipos" ("nombre", "descripcion") VALUES ('riego', 'Productos para riego y nutrición base'), ('preventivo', 'Productos para prevención de plagas y enfermedades'), ('control_plagas', 'Productos para control activo de plagas')`);

        await queryRunner.query(`CREATE TABLE "productos_control_plaga" ("id" SERIAL NOT NULL, "controlPlagaId" integer NOT NULL, "productoId" integer NOT NULL, "cantidad" numeric(8,2) NOT NULL, "unidad" character varying(20) NOT NULL DEFAULT 'ml', CONSTRAINT "PK_e4e47da59417fb4df4fd11bfe0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."control_plagas_metodo_aplicacion_enum" AS ENUM('foliar', 'riego', 'manual', 'otro')`);
        await queryRunner.query(`CREATE TABLE "control_plagas" ("id" SERIAL NOT NULL, "cultivoId" integer NOT NULL, "fecha_aplicacion" date NOT NULL, "metodo_aplicacion" "public"."control_plagas_metodo_aplicacion_enum" NOT NULL DEFAULT 'foliar', "notas" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3672eec90c3031c0fae8d52821" PRIMARY KEY ("id"))`);

        // Agregar tipoId como nullable primero
        await queryRunner.query(`ALTER TABLE "productos_nutricion" ADD "tipoId" integer`);

        // Asignar el tipo 'riego' (ID 1) a todos los productos actuales
        await queryRunner.query(`UPDATE "productos_nutricion" SET "tipoId" = (SELECT id FROM "productos_tipos" WHERE nombre = 'riego' LIMIT 1)`);

        // Ahora hacerlo NOT NULL
        await queryRunner.query(`ALTER TABLE "productos_nutricion" ALTER COLUMN "tipoId" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "faseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_nutricion" ADD CONSTRAINT "FK_1d0fcab8a92d674c2aa3d2d8ba3" FOREIGN KEY ("tipoId") REFERENCES "productos_tipos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" ADD CONSTRAINT "FK_3a63cb2ce3f61ff50899667f18e" FOREIGN KEY ("faseHistorialId") REFERENCES "cultivos_fases_historial"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_control_plaga" ADD CONSTRAINT "FK_29e8e2d82fd4a9179919d2a2a2e" FOREIGN KEY ("controlPlagaId") REFERENCES "control_plagas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos_control_plaga" ADD CONSTRAINT "FK_388c5281d87466d697712ae58a9" FOREIGN KEY ("productoId") REFERENCES "productos_nutricion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "control_plagas" ADD CONSTRAINT "FK_6a2feee04ff07fc9cf0869c9d4f" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos" ADD CONSTRAINT "FK_c04137b6255d0e8c186856eadf3" FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" ADD CONSTRAINT "FK_0b83793e19cf715b12b169b7bb9" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" ADD CONSTRAINT "FK_aa11adb1880f94714564973ba07" FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" DROP CONSTRAINT "FK_aa11adb1880f94714564973ba07"`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" DROP CONSTRAINT "FK_0b83793e19cf715b12b169b7bb9"`);
        await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_c04137b6255d0e8c186856eadf3"`);
        await queryRunner.query(`ALTER TABLE "control_plagas" DROP CONSTRAINT "FK_6a2feee04ff07fc9cf0869c9d4f"`);
        await queryRunner.query(`ALTER TABLE "productos_control_plaga" DROP CONSTRAINT "FK_388c5281d87466d697712ae58a9"`);
        await queryRunner.query(`ALTER TABLE "productos_control_plaga" DROP CONSTRAINT "FK_29e8e2d82fd4a9179919d2a2a2e"`);
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_3a63cb2ce3f61ff50899667f18e"`);
        await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP CONSTRAINT "FK_1d0fcab8a92d674c2aa3d2d8ba3"`);
        await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "faseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "tipoId"`);
        await queryRunner.query(`DROP TABLE "control_plagas"`);
        await queryRunner.query(`DROP TYPE "public"."control_plagas_metodo_aplicacion_enum"`);
        await queryRunner.query(`DROP TABLE "productos_control_plaga"`);
        await queryRunner.query(`DROP TABLE "productos_tipos"`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" ADD CONSTRAINT "FK_cultivo_historial" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_fases_historial" ADD CONSTRAINT "FK_fase_historial" FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos" ADD CONSTRAINT "FK_cultivo_fase_actual" FOREIGN KEY ("faseId") REFERENCES "fases_cultivo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nutricion_semanal" ADD CONSTRAINT "FK_nutricion_fase_historial" FOREIGN KEY ("faseHistorialId") REFERENCES "cultivos_fases_historial"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
