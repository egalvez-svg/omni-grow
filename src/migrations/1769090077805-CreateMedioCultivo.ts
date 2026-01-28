import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMedioCultivo1769090077805 implements MigrationInterface {
  name = 'CreateMedioCultivo1769090077805'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medios_cultivo" ("id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" text, CONSTRAINT "UQ_c1ab65e588a8d5eaa2cbaa029cb" UNIQUE ("nombre"), CONSTRAINT "PK_5875bb8575f9c4cb37d55e8d0ff" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "cultivos" ADD "medioCultivoId" integer`)
    await queryRunner.query(
      `ALTER TABLE "cultivos" ADD CONSTRAINT "FK_9317b4658266c0ba25b389f1926" FOREIGN KEY ("medioCultivoId") REFERENCES "medios_cultivo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(`INSERT INTO "medios_cultivo" ("nombre", "descripcion") VALUES 
            ('sustrato', 'Mezcla de tierra preparada'),
            ('coco', 'Fibra de coco inerte'),
            ('living soil', 'Suelo vivo con microbiología activa'),
            ('hidroponia', 'Cultivo en agua con nutrientes disueltos'),
            ('aeroclonadoras', 'Sistema aeropónico para esquejes')
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_9317b4658266c0ba25b389f1926"`)
    await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "medioCultivoId"`)
    await queryRunner.query(`DROP TABLE "medios_cultivo"`)
  }
}
