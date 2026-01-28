import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCultivoEnum1768581094126 implements MigrationInterface {
  name = 'UpdateCultivoEnum1768581094126'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."cultivos_estado_enum" RENAME TO "cultivos_estado_enum_old"`)
    await queryRunner.query(
      `CREATE TYPE "public"."cultivos_estado_enum" AS ENUM('esqueje', 'vegetativo', 'floracion', 'cosecha', 'finalizado')`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "estado" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ALTER COLUMN "estado" TYPE "public"."cultivos_estado_enum" USING "estado"::"text"::"public"."cultivos_estado_enum"`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "estado" SET DEFAULT 'vegetativo'`)
    await queryRunner.query(`DROP TYPE "public"."cultivos_estado_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cultivos_estado_enum_old" AS ENUM('vegetativo', 'floracion', 'cosecha', 'finalizado')`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "estado" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ALTER COLUMN "estado" TYPE "public"."cultivos_estado_enum_old" USING "estado"::"text"::"public"."cultivos_estado_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ALTER COLUMN "estado" SET DEFAULT 'vegetativo'`)
    await queryRunner.query(`DROP TYPE "public"."cultivos_estado_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."cultivos_estado_enum_old" RENAME TO "cultivos_estado_enum"`)
  }
}
