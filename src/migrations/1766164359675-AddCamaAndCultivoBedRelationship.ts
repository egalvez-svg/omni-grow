import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCamaAndCultivoBedRelationship1766164359675 implements MigrationInterface {
  name = 'AddCamaAndCultivoBedRelationship1766164359675'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "camas" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" text, "capacidad_plantas" integer NOT NULL DEFAULT '0', "filas" integer NOT NULL DEFAULT '0', "columnas" integer NOT NULL DEFAULT '0', "salaId" integer NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed42a5b14d01cafe0bc74dfd552" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ADD "camaId" integer`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_42bab3740192e21dc9b5349155a" FOREIGN KEY ("camaId") REFERENCES "camas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "camas" ADD CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "camas" DROP CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_42bab3740192e21dc9b5349155a"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "camaId"`)
    await queryRunner.query(`DROP TABLE "camas"`)
  }
}
