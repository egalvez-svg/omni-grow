import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrigenToIaAnalisis1769178237681 implements MigrationInterface {
    name = 'AddOrigenToIaAnalisis1769178237681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ia_analisis" ADD "origen" character varying(20) NOT NULL DEFAULT 'sensor'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ia_analisis" DROP COLUMN "origen"`);
    }

}
