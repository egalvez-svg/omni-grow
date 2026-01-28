import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixMissingColumnsInVariedades1766762539753 implements MigrationInterface {
  name = 'FixMissingColumnsInVariedades1766762539753'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."productos_nutricion_tipo_enum"`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "unidad"`)
    await queryRunner.query(`DROP TYPE "public"."productos_nutricion_unidad_enum"`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "marca"`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "npk"`)
    await queryRunner.query(`ALTER TABLE "variedades" DROP COLUMN "tiempo_floracion_dias"`)
    await queryRunner.query(`ALTER TABLE "variedades" DROP COLUMN "notas"`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" ADD "fabricante" character varying(50)`)
    await queryRunner.query(`ALTER TABLE "variedades" ADD "banco" character varying(50)`)
    await queryRunner.query(`ALTER TABLE "productos_riego" ALTER COLUMN "dosis_por_litro" TYPE numeric(8,2)`)
    await queryRunner.query(`ALTER TABLE "variedades" DROP COLUMN "tipo"`)
    await queryRunner.query(
      `CREATE TYPE "public"."variedades_tipo_enum" AS ENUM('indica', 'sativa', 'hibrida', 'automatica')`
    )
    await queryRunner.query(`ALTER TABLE "variedades" ADD "tipo" "public"."variedades_tipo_enum"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "variedades" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."variedades_tipo_enum"`)
    await queryRunner.query(`ALTER TABLE "variedades" ADD "tipo" character varying(50)`)
    await queryRunner.query(`ALTER TABLE "productos_riego" ALTER COLUMN "dosis_por_litro" TYPE numeric(10,2)`)
    await queryRunner.query(`ALTER TABLE "variedades" DROP COLUMN "banco"`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" DROP COLUMN "fabricante"`)
    await queryRunner.query(`ALTER TABLE "variedades" ADD "notas" text`)
    await queryRunner.query(`ALTER TABLE "variedades" ADD "tiempo_floracion_dias" integer`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" ADD "npk" character varying(20)`)
    await queryRunner.query(`ALTER TABLE "productos_nutricion" ADD "marca" character varying(50)`)
    await queryRunner.query(`CREATE TYPE "public"."productos_nutricion_unidad_enum" AS ENUM('ml', 'gr')`)
    await queryRunner.query(
      `ALTER TABLE "productos_nutricion" ADD "unidad" "public"."productos_nutricion_unidad_enum" NOT NULL DEFAULT 'ml'`
    )
    await queryRunner.query(`CREATE TYPE "public"."productos_nutricion_tipo_enum" AS ENUM('liquido', 'solido')`)
    await queryRunner.query(
      `ALTER TABLE "productos_nutricion" ADD "tipo" "public"."productos_nutricion_tipo_enum" NOT NULL DEFAULT 'liquido'`
    )
  }
}
