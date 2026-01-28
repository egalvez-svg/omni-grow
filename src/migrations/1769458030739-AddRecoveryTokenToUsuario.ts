import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecoveryTokenToUsuario1769458030739 implements MigrationInterface {
    name = 'AddRecoveryTokenToUsuario1769458030739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "recovery_token" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "recovery_token_expires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "recovery_token_expires"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "recovery_token"`);
    }

}
