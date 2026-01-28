import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUsuario1769450747744 implements MigrationInterface {
    name = 'AddRefreshTokenToUsuario1769450747744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "refresh_token" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "refresh_token"`);
    }

}
