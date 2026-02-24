import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ClimaService } from './clima.service'

@ApiTags('Clima')
@Controller('clima')
export class ClimaController {
  constructor(private readonly climaService: ClimaService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener el clima actual' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitud (default: IP o Córdoba)' })
  @ApiQuery({ name: 'lon', required: false, description: 'Longitud (default: IP o Córdoba)' })
  async getClima(@Query('lat') lat?: number, @Query('lon') lon?: number, @Ip() ip?: string) {
    let latitude = lat
    let longitude = lon
    let locationInfo = { city: 'Córdoba', region: 'Córdoba', country: 'Argentina' }

    if (!latitude || !longitude) {
      const ipLocation = ip ? await this.climaService.getLocationFromIp(ip) : null
      if (ipLocation) {
        latitude = ipLocation.lat
        longitude = ipLocation.lon
        locationInfo = {
          city: ipLocation.city,
          region: ipLocation.region,
          country: ipLocation.country
        }
      }
    } else {
      locationInfo = await this.climaService.getLocationName(latitude, longitude)
    }

    if (!latitude || !longitude) {
      latitude = -31.4201
      longitude = -64.1888
    }

    const weather = await this.climaService.getClima(latitude, longitude)

    return {
      ...weather,
      ubicacion: locationInfo
    }
  }
}
