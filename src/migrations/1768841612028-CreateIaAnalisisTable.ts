import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateIaAnalisisTable1768841612028 implements MigrationInterface {
  name = 'CreateIaAnalisisTable1768841612028'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ia_analisis" ("id" SERIAL NOT NULL, "cultivoId" integer NOT NULL, "snapshot" json NOT NULL, "analisis" text NOT NULL, "fecha" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4b56fc09fe18c6d097e73171f3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "ia_analisis" ADD CONSTRAINT "FK_68a8df566849df22c73205d3131" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ia_analisis" DROP CONSTRAINT "FK_68a8df566849df22c73205d3131"`)
    await queryRunner.query(`DROP TABLE "ia_analisis"`)
  }
}
