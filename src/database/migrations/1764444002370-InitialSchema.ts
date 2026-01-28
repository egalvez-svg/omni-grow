import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1764444002370 implements MigrationInterface {
  name = 'InitialSchema1764444002370'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create rol table
    await queryRunner.query(`
            CREATE TABLE "rol" (
                "id" SERIAL NOT NULL,
                "nombre" character varying NOT NULL,
                "creado_por" integer,
                "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(),
                "modificado_por" integer,
                "fecha_modificacion" TIMESTAMP NOT NULL DEFAULT now(),
                "activo" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_rol" PRIMARY KEY ("id")
            )
        `)

    // Create usuario table
    await queryRunner.query(`
            CREATE TABLE "usuario" (
                "id" SERIAL NOT NULL,
                "nombre" character varying(25),
                "apellido_paterno" character varying(25),
                "apellido_materno" character varying(25) NOT NULL,
                "usuario" character varying(10) NOT NULL,
                "email" character varying(50) NOT NULL,
                "password" character varying,
                "creado_por" integer,
                "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(),
                "modificado_por" integer,
                "fecha_modificacion" TIMESTAMP NOT NULL DEFAULT now(),
                "activo" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_usuario_usuario" UNIQUE ("usuario"),
                CONSTRAINT "UQ_usuario_email" UNIQUE ("email"),
                CONSTRAINT "PK_usuario" PRIMARY KEY ("id")
            )
        `)

    // Create usuario_rol junction table
    await queryRunner.query(`
            CREATE TABLE "usuario_rol" (
                "usuario_id" integer NOT NULL,
                "rol_id" integer NOT NULL,
                CONSTRAINT "PK_usuario_rol" PRIMARY KEY ("usuario_id", "rol_id")
            )
        `)

    // Create dispositivos table
    await queryRunner.query(`
            CREATE TABLE "dispositivos" (
                "id" SERIAL NOT NULL,
                "nombre" character varying(100) NOT NULL,
                "descripcion" text,
                "ubicacion" character varying(150),
                "ip" character varying(45),
                "usuarioId" integer,
                "creado_en" TIMESTAMP NOT NULL DEFAULT now(),
                "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_dispositivos" PRIMARY KEY ("id")
            )
        `)

    // Create gpio table with enum type
    await queryRunner.query(`
            CREATE TYPE "gpio_tipo_enum" AS ENUM('sensor', 'actuador')
        `)
    await queryRunner.query(`
            CREATE TABLE "gpio" (
                "id" SERIAL NOT NULL,
                "pin" integer NOT NULL,
                "tipo" "gpio_tipo_enum" NOT NULL,
                "nombre" character varying(100),
                "activo" boolean NOT NULL DEFAULT true,
                "dispositivoId" integer,
                CONSTRAINT "PK_gpio" PRIMARY KEY ("id")
            )
        `)

    // Create sensores table
    await queryRunner.query(`
            CREATE TABLE "sensores" (
                "id" SERIAL NOT NULL,
                "gpioId" integer,
                "tipo" character varying(50) NOT NULL,
                "unidad" character varying(20) NOT NULL,
                "activo" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_sensores" PRIMARY KEY ("id")
            )
        `)

    // Create actuadores table
    await queryRunner.query(`
            CREATE TABLE "actuadores" (
                "id" SERIAL NOT NULL,
                "gpioId" integer,
                "tipo" character varying(50) NOT NULL,
                "estado" boolean NOT NULL DEFAULT false,
                "activo" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_actuadores" PRIMARY KEY ("id")
            )
        `)

    // Create lecturas table
    await queryRunner.query(`
            CREATE TABLE "lecturas" (
                "id" SERIAL NOT NULL,
                "valor" numeric(10,2) NOT NULL,
                "registrado_en" TIMESTAMP NOT NULL DEFAULT now(),
                "sensorId" integer,
                CONSTRAINT "PK_lecturas" PRIMARY KEY ("id")
            )
        `)

    // Create index on lecturas.sensorId
    await queryRunner.query(`
            CREATE INDEX "IDX_lecturas_sensorId" ON "lecturas" ("sensorId")
        `)

    // Create reglas table with enum types
    await queryRunner.query(`
            CREATE TYPE "reglas_comparador_enum" AS ENUM('>', '<', '>=', '<=', '=')
        `)
    await queryRunner.query(`
            CREATE TYPE "reglas_accion_enum" AS ENUM('encender', 'apagar', 'toggle')
        `)
    await queryRunner.query(`
            CREATE TABLE "reglas" (
                "id" SERIAL NOT NULL,
                "nombre" character varying(100) NOT NULL,
                "comparador" "reglas_comparador_enum" NOT NULL,
                "valor_trigger" numeric(10,2) NOT NULL,
                "accion" "reglas_accion_enum" NOT NULL,
                "delay_segundos" integer NOT NULL DEFAULT 0,
                "habilitada" boolean NOT NULL DEFAULT true,
                "creado_en" TIMESTAMP NOT NULL DEFAULT now(),
                "sensorId" integer,
                "actuadorId" integer,
                CONSTRAINT "PK_reglas" PRIMARY KEY ("id")
            )
        `)

    // Add foreign keys
    await queryRunner.query(`
            ALTER TABLE "usuario_rol"
            ADD CONSTRAINT "FK_usuario_rol_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "usuario_rol"
            ADD CONSTRAINT "FK_usuario_rol_rol" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "dispositivos"
            ADD CONSTRAINT "FK_dispositivos_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "gpio"
            ADD CONSTRAINT "FK_gpio_dispositivo" FOREIGN KEY ("dispositivoId") REFERENCES "dispositivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "sensores"
            ADD CONSTRAINT "FK_sensores_gpio" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "actuadores"
            ADD CONSTRAINT "FK_actuadores_gpio" FOREIGN KEY ("gpioId") REFERENCES "gpio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "lecturas"
            ADD CONSTRAINT "FK_lecturas_sensor" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "reglas"
            ADD CONSTRAINT "FK_reglas_sensor" FOREIGN KEY ("sensorId") REFERENCES "sensores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "reglas"
            ADD CONSTRAINT "FK_reglas_actuador" FOREIGN KEY ("actuadorId") REFERENCES "actuadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_reglas_actuador"`)
    await queryRunner.query(`ALTER TABLE "reglas" DROP CONSTRAINT "FK_reglas_sensor"`)
    await queryRunner.query(`ALTER TABLE "lecturas" DROP CONSTRAINT "FK_lecturas_sensor"`)
    await queryRunner.query(`ALTER TABLE "actuadores" DROP CONSTRAINT "FK_actuadores_gpio"`)
    await queryRunner.query(`ALTER TABLE "sensores" DROP CONSTRAINT "FK_sensores_gpio"`)
    await queryRunner.query(`ALTER TABLE "gpio" DROP CONSTRAINT "FK_gpio_dispositivo"`)
    await queryRunner.query(`ALTER TABLE "dispositivos" DROP CONSTRAINT "FK_dispositivos_usuario"`)
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_usuario_rol_rol"`)
    await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_usuario_rol_usuario"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE "reglas"`)
    await queryRunner.query(`DROP TYPE "reglas_accion_enum"`)
    await queryRunner.query(`DROP TYPE "reglas_comparador_enum"`)
    await queryRunner.query(`DROP INDEX "IDX_lecturas_sensorId"`)
    await queryRunner.query(`DROP TABLE "lecturas"`)
    await queryRunner.query(`DROP TABLE "actuadores"`)
    await queryRunner.query(`DROP TABLE "sensores"`)
    await queryRunner.query(`DROP TABLE "gpio"`)
    await queryRunner.query(`DROP TYPE "gpio_tipo_enum"`)
    await queryRunner.query(`DROP TABLE "dispositivos"`)
    await queryRunner.query(`DROP TABLE "usuario_rol"`)
    await queryRunner.query(`DROP TABLE "usuario"`)
    await queryRunner.query(`DROP TABLE "rol"`)
  }
}
