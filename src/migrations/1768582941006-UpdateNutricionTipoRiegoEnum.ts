import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateNutricionTipoRiegoEnum1768582941006 implements MigrationInterface {
  name = 'UpdateNutricionTipoRiegoEnum1768582941006'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."nutricion_semanal_tipo_riego_enum" RENAME TO "nutricion_semanal_tipo_riego_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."nutricion_semanal_tipo_riego_enum" AS ENUM('nutricion', 'solo_agua', 'lavado_raices', 'agua_esquejes')`
    )
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" TYPE "public"."nutricion_semanal_tipo_riego_enum" USING "tipo_riego"::"text"::"public"."nutricion_semanal_tipo_riego_enum"`
    )
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" SET DEFAULT 'nutricion'`)
    await queryRunner.query(`DROP TYPE "public"."nutricion_semanal_tipo_riego_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."nutricion_semanal_tipo_riego_enum_old" AS ENUM('nutricion', 'solo_agua', 'lavado_raices')`
    )
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" TYPE "public"."nutricion_semanal_tipo_riego_enum_old" USING "tipo_riego"::"text"::"public"."nutricion_semanal_tipo_riego_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" ALTER COLUMN "tipo_riego" SET DEFAULT 'nutricion'`)
    await queryRunner.query(`DROP TYPE "public"."nutricion_semanal_tipo_riego_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."nutricion_semanal_tipo_riego_enum_old" RENAME TO "nutricion_semanal_tipo_riego_enum"`
    )
  }
}
