import { Injectable } from '@nestjs/common'
import { HistoricalDataPointDto, SensorReadingDto } from '../dto/sensor-reading.dto'

@Injectable()
export class MockSensorDataService {
  /**
   * Calcula el VPD (Vapor Pressure Deficit) en kPa
   * @param temperatura Temperatura en °C
   * @param humedadRelativa Humedad relativa en %
   */
  private calcularVPD(temperatura: number, humedadRelativa: number): number {
    // Fórmula de presión de vapor saturado (SVP) usando ecuación de Magnus
    const svp = 0.61078 * Math.exp((17.27 * temperatura) / (temperatura + 237.3))

    // Presión de vapor actual (AVP)
    const avp = svp * (humedadRelativa / 100)

    // VPD = SVP - AVP
    const vpd = svp - avp

    return Math.round(vpd * 100) / 100 // Redondear a 2 decimales
  }

  /**
   * Genera un valor aleatorio dentro de un rango con variación
   */
  private generarValorAleatorio(min: number, max: number, decimales: number = 1): number {
    const valor = min + Math.random() * (max - min)
    const multiplicador = Math.pow(10, decimales)
    return Math.round(valor * multiplicador) / multiplicador
  }

  /**
   * Genera valores base según la hora del día (simulación de ciclo diurno/nocturno)
   */
  private obtenerValoresBase(hora: number): { temp: number; humedad: number; co2: number } {
    // Ciclo de luz: 6:00 - 22:00 (16 horas luz, 8 horas oscuridad)
    const esDia = hora >= 6 && hora < 22

    if (esDia) {
      // Día: temperatura más alta, humedad más baja, CO2 más bajo (plantas consumen)
      return {
        temp: this.generarValorAleatorio(24, 28, 1),
        humedad: this.generarValorAleatorio(45, 60, 1),
        co2: this.generarValorAleatorio(600, 900, 0)
      }
    } else {
      // Noche: temperatura más baja, humedad más alta, CO2 más alto (plantas respiran)
      return {
        temp: this.generarValorAleatorio(18, 22, 1),
        humedad: this.generarValorAleatorio(55, 70, 1),
        co2: this.generarValorAleatorio(800, 1200, 0)
      }
    }
  }

  /**
   * Genera una lectura actual para un sensor específico
   */
  generarLecturaActual(sensorId: number, tipo: string, unidad: string): SensorReadingDto {
    const ahora = new Date()
    const hora = ahora.getHours()
    const valoresBase = this.obtenerValoresBase(hora)

    let valor: number
    let min: number
    let max: number

    switch (tipo.toLowerCase()) {
      case 'temperatura':
      case 'temp':
        valor = valoresBase.temp
        min = 18.0 // Min nocturno típico
        max = 28.0 // Max diurno típico
        break
      case 'humedad':
        valor = valoresBase.humedad
        min = 40.0
        max = 70.0
        break
      case 'vpd':
        // Calcular VPD basado en temperatura y humedad simuladas
        valor = this.calcularVPD(valoresBase.temp, valoresBase.humedad)
        // Estimación de rango VPD saludable
        min = 0.4
        max = 1.6
        break
      case 'co2':
      case 'ppm':
        valor = valoresBase.co2
        min = 400
        max = 1200
        break
      default:
        valor = this.generarValorAleatorio(0, 100, 1)
        min = 0
        max = 100
    }

    return {
      sensorId,
      tipo,
      valor,
      unidad,
      timestamp: ahora,
      min,
      max,
      estado: 'activo'
    }
  }

  /**
   * Genera datos históricos para un sensor
   * @param sensorId ID del sensor
   * @param tipo Tipo de sensor
   * @param horasAtras Cantidad de horas hacia atrás
   * @param intervaloMinutos Intervalo entre puntos de datos en minutos
   */
  generarDatosHistoricos(
    sensorId: number,
    tipo: string,
    horasAtras: number = 24,
    intervaloMinutos: number = 5
  ): HistoricalDataPointDto[] {
    const datos: HistoricalDataPointDto[] = []
    const ahora = new Date()
    const cantidadPuntos = (horasAtras * 60) / intervaloMinutos

    for (let i = cantidadPuntos; i >= 0; i--) {
      const timestamp = new Date(ahora.getTime() - i * intervaloMinutos * 60 * 1000)
      const hora = timestamp.getHours()
      const valoresBase = this.obtenerValoresBase(hora)

      let valor: number

      switch (tipo.toLowerCase()) {
        case 'temperatura':
        case 'temp':
          // Agregar pequeña variación aleatoria
          valor = valoresBase.temp + this.generarValorAleatorio(-0.5, 0.5, 1)
          break
        case 'humedad':
          valor = valoresBase.humedad + this.generarValorAleatorio(-2, 2, 1)
          break
        case 'vpd':
          const temp = valoresBase.temp + this.generarValorAleatorio(-0.5, 0.5, 1)
          const hum = valoresBase.humedad + this.generarValorAleatorio(-2, 2, 1)
          valor = this.calcularVPD(temp, hum)
          break
        case 'co2':
        case 'ppm':
          valor = valoresBase.co2 + this.generarValorAleatorio(-50, 50, 0)
          break
        default:
          valor = this.generarValorAleatorio(0, 100, 1)
      }

      datos.push({
        timestamp,
        valor
      })
    }

    return datos
  }

  /**
   * Genera lecturas actuales para múltiples sensores de un dispositivo
   */
  generarLecturasDispositivo(sensores: Array<{ id: number; tipo: string; unidad: string }>): SensorReadingDto[] {
    return sensores.map(sensor => this.generarLecturaActual(sensor.id, sensor.tipo, sensor.unidad))
  }
}
