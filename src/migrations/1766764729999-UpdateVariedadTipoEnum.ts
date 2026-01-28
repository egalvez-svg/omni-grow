import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateVariedadTipoEnum1766764729999 implements MigrationInterface {
  name = 'UpdateVariedadTipoEnum1766764729999'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."variedades_tipo_enum" RENAME TO "variedades_tipo_enum_old"`)
    await queryRunner.query(
      `CREATE TYPE "public"."variedades_tipo_enum" AS ENUM('indica', 'sativa', 'hibrida', 'rudelaris')`
    )
    await queryRunner.query(
      `ALTER TABLE "variedades" ALTER COLUMN "tipo" TYPE "public"."variedades_tipo_enum" USING "tipo"::"text"::"public"."variedades_tipo_enum"`
    )
    await queryRunner.query(`DROP TYPE "public"."variedades_tipo_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."variedades_tipo_enum_old" AS ENUM('indica', 'sativa', 'hibrida', 'automatica')`
    )
    await queryRunner.query(
      `ALTER TABLE "variedades" ALTER COLUMN "tipo" TYPE "public"."variedades_tipo_enum_old" USING "tipo"::"text"::"public"."variedades_tipo_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "public"."variedades_tipo_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."variedades_tipo_enum_old" RENAME TO "variedades_tipo_enum"`)
  }
}
