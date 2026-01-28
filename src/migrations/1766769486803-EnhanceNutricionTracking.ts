import { MigrationInterface, QueryRunner } from 'typeorm'

export class EnhanceNutricionTracking1766769486803 implements MigrationInterface {
  name = 'EnhanceNutricionTracking1766769486803'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."nutricion_semanal_tipo_riego_enum" AS ENUM('nutricion', 'solo_agua', 'lavado_raices')`
    )
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ADD "tipo_riego" "public"."nutricion_semanal_tipo_riego_enum" NOT NULL DEFAULT 'nutricion'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP COLUMN "tipo_riego"`)
    await queryRunner.query(`DROP TYPE "public"."nutricion_semanal_tipo_riego_enum"`)
  }
}
