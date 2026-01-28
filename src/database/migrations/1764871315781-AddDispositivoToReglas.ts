import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDispositivoToReglas1764871315781 implements MigrationInterface {
  name = 'AddDispositivoToReglas1764871315781'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reglas" ADD "dispositivoId" integer`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "delay_segundos" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "reglas" ADD CONSTRAINT "FK_3ca2f04e30040fcb649749d3a82" FOREIGN KEY ("dispositivoId") REFERENCES "dispositivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_3ca2f04e30040fcb649749d3a82"`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "delay_segundos" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "dispositivoId"`)
  }
}
