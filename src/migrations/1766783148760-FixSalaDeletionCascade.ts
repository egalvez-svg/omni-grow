import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixSalaDeletionCascade1766783148760 implements MigrationInterface {
  name = 'FixSalaDeletionCascade1766783148760'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_323664906d45855774acaa80b5d"`)
    await queryRunner.query(`ALTER TABLE "camas" DROP CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee"`)
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_583983a76ce6fec9c27e243d642"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_233c09ec4fe0d44f5551249a249"`)
    await queryRunner.query(
      `ALTER TABLE "dispositivos" ADD CONSTRAINT "FK_323664906d45855774acaa80b5d" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "camas" ADD CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ADD CONSTRAINT "FK_583983a76ce6fec9c27e243d642" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "plantas_posicion" ADD CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_233c09ec4fe0d44f5551249a249" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_233c09ec4fe0d44f5551249a249"`)
    await queryRunner.query(`ALTER TABLE "plantas_posicion" DROP CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb"`)
    await queryRunner.query(`ALTER TABLE "nutricion_semanal" DROP CONSTRAINT "FK_583983a76ce6fec9c27e243d642"`)
    await queryRunner.query(`ALTER TABLE "camas" DROP CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee"`)
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_323664906d45855774acaa80b5d"`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_233c09ec4fe0d44f5551249a249" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "plantas_posicion" ADD CONSTRAINT "FK_eeccadcda5bdb8e7f4fc0893deb" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nutricion_semanal" ADD CONSTRAINT "FK_583983a76ce6fec9c27e243d642" FOREIGN KEY ("cultivoId") REFERENCES "cultivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "camas" ADD CONSTRAINT "FK_92ee97bc0023a4e3a319710dfee" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dispositivos" ADD CONSTRAINT "FK_323664906d45855774acaa80b5d" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
