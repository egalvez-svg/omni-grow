import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCodeAndVariedadToPlantasPosicion1766767623191 implements MigrationInterface {
  name = 'AddCodeAndVariedadToPlantasPosicion1766767623191'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plantas_posicion" ADD "codigo" character varying(50)`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" ADD "variedadId" integer`)
    await queryRunner.query(
      `ALTER TABLE "plantas_posicion" ADD CONSTRAINT "FK_6278aa1b7f9b1c5cc79ee8724f4" FOREIGN KEY ("variedadId") REFERENCES "variedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP CONSTRAINT "FK_6278aa1b7f9b1c5cc79ee8724f4"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP COLUMN "variedadId"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP COLUMN "codigo"`)
  }
}
