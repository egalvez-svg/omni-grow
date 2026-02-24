import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEstadoMappingToFases1740000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Añadir columna mapeo_estado
        await queryRunner.query(`ALTER TABLE "fases_cultivo" ADD "mapeo_estado" varchar(50)`)

        // 2. Poblar con valores iniciales basados en los slugs actuales
        const mappings = {
            'semilla': 'vegetativo',
            'esqueje': 'esqueje',
            'vegetativo': 'vegetativo',
            'pre-floracion': 'vegetativo',
            'floracion': 'floracion',
            'cosecha': 'cosecha',
            'finalizado': 'finalizado'
        }

        for (const [slug, estado] of Object.entries(mappings)) {
            await queryRunner.query(
                `UPDATE "fases_cultivo" SET "mapeo_estado" = $1 WHERE "slug" = $2`,
                [estado, slug]
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fases_cultivo" DROP COLUMN "mapeo_estado"`)
    }
}
