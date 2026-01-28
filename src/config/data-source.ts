import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { getTypeOrmConfig } from './typeorm.config'

config()

export const AppDataSource = new DataSource(getTypeOrmConfig(true))
