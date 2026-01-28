import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTimeBasedRules1764867679875 implements MigrationInterface {
  name = 'AddTimeBasedRules1764867679875'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_dispositivos_usuario"`)
    await queryRunner.query(`ALTER TABLE "sensores" DROP CONSTRAINT "FK_sensores_gpio"`)
    await queryRunner.query(`ALTER TABLE "gpio" DROP CONSTRAINT "FK_gpio_dispositivo"`)
    await queryRunner.query(`ALTER TABLE "actuadores" DROP CONSTRAINT "FK_actuadores_gpio"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_reglas_sensor"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_reglas_actuador"`)
    await queryRunner.query(`ALTER TABLE "lecturas" DROP CONSTRAINT "FK_lecturas_sensor"`)
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_usuario_rol_usuario"`)
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_usuario_rol_rol"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_lecturas_sensorId"`)
    await queryRunner.query(
      `CREATE TABLE "actuadores_log" ("id" SERIAL NOT NULL, "accion" character varying(100) NOT NULL, "valor" smallint, "registrado_en" TIMESTAMP NOT NULL DEFAULT now(), "actuadorId" integer, CONSTRAINT "PK_0c5ef26fc32a11ae6de5c0f266b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_20df72997364a3e8028a2aedf3" ON "actuadores_log" ("actuadorId") `)
    await queryRunner.query(`CREATE TYPE "public"."reglas_tipo_enum" AS ENUM('sensor', 'horario')`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "tipo" "public"."reglas_tipo_enum" NOT NULL DEFAULT 'sensor'`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "horaInicio" character varying(5)`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "horaFin" character varying(5)`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "diasSemana" json`)
    await queryRunner.query(`CREATE TYPE "public"."reglas_accioninicio_enum" AS ENUM('encender', 'apagar')`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "accionInicio" "public"."reglas_accioninicio_enum"`)
    await queryRunner.query(`CREATE TYPE "public"."reglas_accionfin_enum" AS ENUM('encender', 'apagar')`)
    await queryRunner.query(`ALTER TABLE "reglas" ADD "accionFin" "public"."reglas_accionfin_enum"`)
    await queryRunner.query(`ALTER TABLE "rol" DROP COLUMN "nombre"`)
    await queryRunner.query(`CREATE TYPE "public"."rol_nombre_enum" AS ENUM('admin', 'user', 'bodega')`)
    await queryRunner.query(`ALTER TABLE "rol" ADD "nombre" "public"."rol_nombre_enum" NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "comparador" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "valor_trigger" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "accion" DROP NOT NULL`)
    await queryRunner.query(`CREATE INDEX "IDX_987426199ead55319f1c677bc0" ON "lecturas" ("sensorId") `)
    await queryRunner.query(`CREATE INDEX "IDX_29e9a9079c7ba01c1b301cf555" ON "usuario_rol" ("usuario_id") `)
    await queryRunner.query(`CREATE INDEX "IDX_ac8911cd54a61461c992654140" ON "usuario_rol" ("rol_id") `)
    await queryRunner.query(
      `ALTER TABLE "dispositivos" ADD CONSTRAINT "FK_a73980fe3cbd17c6833700de0d0" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sensores" ADD CONSTRAINT "FK_b860cf80131c6a2995e230e33cb" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "gpio" ADD CONSTRAINT "FK_c362bce74399be6475be6d7a4f8" FOREIGN KEY ("dispositivoId") REFERENCES "dispositivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "actuadores" ADD CONSTRAINT "FK_f20ccd9988050ce9f378e0fdbb1" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reglas" ADD CONSTRAINT "FK_7f29ba31079457874bfb518e759" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reglas" ADD CONSTRAINT "FK_4039902c995f9daa8ed5483822b" FOREIGN KEY ("actuadorId") REFERENCES "actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "lecturas" ADD CONSTRAINT "FK_987426199ead55319f1c677bc06" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "actuadores_log" ADD CONSTRAINT "FK_20df72997364a3e8028a2aedf37" FOREIGN KEY ("actuadorId") REFERENCES "actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_29e9a9079c7ba01c1b301cf5555" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_ac8911cd54a61461c9926541401" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_ac8911cd54a61461c9926541401"`)
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_29e9a9079c7ba01c1b301cf5555"`)
    await queryRunner.query(`ALTER TABLE "actuadores_log" DROP CONSTRAINT "FK_20df72997364a3e8028a2aedf37"`)
    await queryRunner.query(`ALTER TABLE "lecturas" DROP CONSTRAINT "FK_987426199ead55319f1c677bc06"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_4039902c995f9daa8ed5483822b"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_7f29ba31079457874bfb518e759"`)
    await queryRunner.query(`ALTER TABLE "actuadores" DROP CONSTRAINT "FK_f20ccd9988050ce9f378e0fdbb1"`)
    await queryRunner.query(`ALTER TABLE "gpio" DROP CONSTRAINT "FK_c362bce74399be6475be6d7a4f8"`)
    await queryRunner.query(`ALTER TABLE "sensores" DROP CONSTRAINT "FK_b860cf80131c6a2995e230e33cb"`)
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_a73980fe3cbd17c6833700de0d0"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ac8911cd54a61461c992654140"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_29e9a9079c7ba01c1b301cf555"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_987426199ead55319f1c677bc0"`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "accion" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "valor_trigger" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" ALTER COLUMN "comparador" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "rol" DROP COLUMN "nombre"`)
    await queryRunner.query(`DROP TYPE "public"."rol_nombre_enum"`)
    await queryRunner.query(`ALTER TABLE "rol" ADD "nombre" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "accionFin"`)
    await queryRunner.query(`DROP TYPE "public"."reglas_accionfin_enum"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "accionInicio"`)
    await queryRunner.query(`DROP TYPE "public"."reglas_accioninicio_enum"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "diasSemana"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "horaFin"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "horaInicio"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."reglas_tipo_enum"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_20df72997364a3e8028a2aedf3"`)
    await queryRunner.query(`DROP TABLE "actuadores_log"`)
    await queryRunner.query(`CREATE INDEX "IDX_lecturas_sensorId" ON "lecturas" ("sensorId") `)
    await queryRunner.query(
      `ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_usuario_rol_rol" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_usuario_rol_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "lecturas" ADD CONSTRAINT "FK_lecturas_sensor" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reglas" ADD CONSTRAINT "FK_reglas_actuador" FOREIGN KEY ("actuadorId") REFERENCES "actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reglas" ADD CONSTRAINT "FK_reglas_sensor" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "actuadores" ADD CONSTRAINT "FK_actuadores_gpio" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "gpio" ADD CONSTRAINT "FK_gpio_dispositivo" FOREIGN KEY ("dispositivoId") REFERENCES "dispositivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sensores" ADD CONSTRAINT "FK_sensores_gpio" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dispositivos" ADD CONSTRAINT "FK_dispositivos_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
