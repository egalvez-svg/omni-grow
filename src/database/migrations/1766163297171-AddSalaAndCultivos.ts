import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSalaAndCultivos1766163297171 implements MigrationInterface {
  name = 'AddSalaAndCultivos1766163297171'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."productos_nutricion_tipo_enum" AS ENUM('liquido', 'solido')`)
    await queryRunner.query(`CREATE TYPE "public"."productos_nutricion_unidad_enum" AS ENUM('ml', 'gr')`)
    await queryRunner.query(
      `CREATE TABLE "productos_nutricion" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "marca" character varying(50), "tipo" "public"."productos_nutricion_tipo_enum" NOT NULL DEFAULT 'liquido', "unidad" "public"."productos_nutricion_unidad_enum" NOT NULL DEFAULT 'ml', "npk" character varying(20), "descripcion" text, "activo" boolean NOT NULL DEFAULT true, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfd083147d704bda835ff82c691" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "productos_riego" ("id" SERIAL NOT NULL, "nutricionSemanalId" integer NOT NULL, "productoNutricionId" integer NOT NULL, "dosis_por_litro" numeric(10,2) NOT NULL, CONSTRAINT "PK_c63ded25e8a628c2f4feedcdadd" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nutricion_semanal" ("id" SERIAL NOT NULL, "cultivoId" integer NOT NULL, "semana" integer NOT NULL, "fecha_aplicacion" date NOT NULL, "litros_agua" numeric(10,2) NOT NULL, "ph" numeric(4,2), "ec" numeric(6,2), "notas" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6138f43c479206e054fecf09fa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."plantas_posicion_estado_enum" AS ENUM('activa', 'removida', 'cosechada')`
    )
    await queryRunner.query(
      `CREATE TABLE "plantas_posicion" ("id" SERIAL NOT NULL, "cultivoId" integer NOT NULL, "posicion" character varying(10) NOT NULL, "estado" "public"."plantas_posicion_estado_enum" NOT NULL DEFAULT 'activa', "fecha_plantacion" date NOT NULL, "notas" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4679425ae4855c5ce844b1a9325" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "variedades" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "tipo" character varying(50), "descripcion" text, "tiempo_floracion_dias" integer, "notas" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ecd3d151bc89909390b416909a0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."cultivos_estado_enum" AS ENUM('vegetativo', 'floracion', 'cosecha', 'finalizado')`
    )
    await queryRunner.query(
      `CREATE TABLE "cultivos" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "salaId" integer NOT NULL, "variedadId" integer NOT NULL, "fecha_inicio" date NOT NULL, "fecha_fin" date, "estado" "public"."cultivos_estado_enum" NOT NULL DEFAULT 'vegetativo', "cantidad_plantas" integer NOT NULL DEFAULT '0', "notas" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7b1d6fc0a6976acd023dca2d3d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "salas" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" text, "ubicacion" character varying(150), "usuarioId" integer NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a74948c5a75eb1be20b46c321e6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "dispositivos" ADD "salaId" integer`)
    await queryRunner.query(
      `ALTER TABLE "productos_riego" ADD CONSTRAINT "FK_dd0e89d0e50439f3d0ff89eb222" FOREIGN KEY ("nutricionSemanalId") REFERENCES "nutricion_semanal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "productos_riego" ADD CONSTRAINT "FK_0c47371bd807e770c83242153bc" FOREIGN KEY ("productoNutricionId") REFERENCES "productos_nutricion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ADD CONSTRAINT "FK_583983a76ce6fec9c27e243d642" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "plantas_posicion" ADD CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_233c09ec4fe0d44f5551249a249" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_2b64a245e56fb0389f0042a133a" FOREIGN KEY ("variedadId") REFERENCES "variedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "salas" ADD CONSTRAINT "FK_e0b922725eeaf23386afbe787bd" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dispositivos" ADD CONSTRAINT "FK_323664906d45855774acaa80b5d" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_323664906d45855774acaa80b5d"`)
    await queryRunner.query(`ALTER TABLE "salas" DROP CONSTRAINT "FK_e0b922725eeaf23386afbe787bd"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_2b64a245e56fb0389f0042a133a"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_233c09ec4fe0d44f5551249a249"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb"`)
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_583983a76ce6fec9c27e243d642"`)
    await queryRunner.query(`ALTER TABLE "productos_riego" DROP CONSTRAINT "FK_0c47371bd807e770c83242153bc"`)
    await queryRunner.query(`ALTER TABLE "productos_riego" DROP CONSTRAINT "FK_dd0e89d0e50439f3d0ff89eb222"`)
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP COLUMN "salaId"`)
    await queryRunner.query(`DROP TABLE "salas"`)
    await queryRunner.query(`DROP TABLE "cultivos"`)
    await queryRunner.query(`DROP TYPE "public"."cultivos_estado_enum"`)
    await queryRunner.query(`DROP TABLE "variedades"`)
    await queryRunner.query(`DROP TABLE "plantas_posicion"`)
    await queryRunner.query(`DROP TYPE "public"."plantas_posicion_estado_enum"`)
    await queryRunner.query(`DROP TABLE "nutricion_semanal"`)
    await queryRunner.query(`DROP TABLE "productos_riego"`)
    await queryRunner.query(`DROP TABLE "productos_nutricion"`)
    await queryRunner.query(`DROP TYPE "public"."productos_nutricion_unidad_enum"`)
    await queryRunner.query(`DROP TYPE "public"."productos_nutricion_tipo_enum"`)
  }
}
