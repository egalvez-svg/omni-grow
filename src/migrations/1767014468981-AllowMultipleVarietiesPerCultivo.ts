import { MigrationInterface, QueryRunner } from 'typeorm'

export class AllowMultipleVarietiesPerCultivo1767014468981 implements MigrationInterface {
  name = 'AllowMultipleVarietiesPerCultivo1767014468981'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_2b64a245e56fb0389f0042a133a"`)
    await queryRunner.query(
      `CREATE TABLE "cultivos_variedades" ("cultivoId" integer NOT NULL, "variedadId" integer NOT NULL, CONSTRAINT "PK_47cf6102c23b7fc7e36e03bcf88" PRIMARY KEY ("cultivoId", "variedadId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_8e79bb30c451b623ad1a696a71" ON "cultivos_variedades" ("cultivoId") `)
    await queryRunner.query(`CREATE INDEX "IDX_fbcde9623606518d46815d6b70" ON "cultivos_variedades" ("variedadId") `)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "variedadId"`)
    await queryRunner.query(
      `ALTER TABLE "cultivos_variedades" ADD CONSTRAINT "FK_8e79bb30c451b623ad1a696a712" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "cultivos_variedades" ADD CONSTRAINT "FK_fbcde9623606518d46815d6b702" FOREIGN KEY ("variedadId") REFERENCES "variedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cultivos_variedades" DROP CONSTRAINT "FK_fbcde9623606518d46815d6b702"`)
    await queryRunner.query(`ALTER TABLE "cultivos_variedades" DROP CONSTRAINT "FK_8e79bb30c451b623ad1a696a712"`)
    await queryRunner.query(`ALTER TABLE "cultivos" ADD "variedadId" integer NOT NULL`)
    await queryRunner.query(`DROP INDEX "public"."IDX_fbcde9623606518d46815d6b70"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_8e79bb30c451b623ad1a696a71"`)
    await queryRunner.query(`DROP TABLE "cultivos_variedades"`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_2b64a245e56fb0389f0042a133a" FOREIGN KEY ("variedadId") REFERENCES "variedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
