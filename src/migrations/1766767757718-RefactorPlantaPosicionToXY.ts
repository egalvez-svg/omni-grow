import { MigrationInterface, QueryRunner } from 'typeorm'

export class RefactorPlantaPosicionToXY1766767757718 implements MigrationInterface {
  name = 'RefactorPlantaPosicionToXY1766767757718'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP COLUMN "posicion"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" ADD "fila" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" ADD "columna" integer NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP COLUMN "columna"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP COLUMN "fila"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" ADD "posicion" character varying(10) NOT NULL`)
  }
}
