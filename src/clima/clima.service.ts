import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class ClimaService {
  constructor(private readonly httpService: HttpService) {}

  async getClima(lat: number, lon: number) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`
      const { data } = await firstValueFrom(this.httpService.get(url))

      return {
        temperatura: data.current.temperature_2m,
        humedad: data.current.relative_humidity_2m,
        unidad_temp: data.current_units.temperature_2m,
        unidad_hum: data.current_units.relative_humidity_2m,
        condicion: this.interpretarCodigoClima(data.current.weather_code),
        codigo_clima: data.current.weather_code
      }
    } catch (error) {
      throw new HttpException('Error al obtener el clima', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private interpretarCodigoClima(code: number): string {
    // Códigos WMO Weather interpretation
    const codigos: { [key: number]: string } = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna densa',
      56: 'Llovizna helada ligera',
      57: 'Llovizna helada densa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      66: 'Lluvia helada ligera',
      67: 'Lluvia helada intensa',
      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada intensa',
      77: 'Granizo',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos violentos',
      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve intensos',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso'
    }

    return codigos[code] || 'Desconocido'
  }

  async getLocationFromIp(
    ip: string
  ): Promise<{ lat: number; lon: number; city: string; region: string; country: string } | null> {
    try {
      // If localhost or private IP, return null to use default
      if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return null
      }

      const url = `http://ip-api.com/json/${ip}`
      const { data } = await firstValueFrom(this.httpService.get(url))

      if (data.status === 'fail') {
        return null
      }

      return {
        lat: data.lat,
        lon: data.lon,
        city: data.city,
        region: data.regionName,
        country: data.country
      }
    } catch (error) {
      return null
    }
  }

  async getLocationName(lat: number, lon: number): Promise<{ city: string; region: string; country: string }> {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
      const { data } = await firstValueFrom(this.httpService.get(url))

      return {
        city: data.city || data.locality || '',
        region: data.principalSubdivision || '',
        country: data.countryName || ''
      }
    } catch (error) {
      return { city: '', region: '', country: '' }
    }
  }
}
