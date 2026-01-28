import * as fs from 'fs'
import * as path from 'path'

import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'

import * as winston from 'winston'

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger
  private context?: string

  constructor() {
    const environment = process.env.NODE_ENV ?? 'dev'
    const logDir = process.env.LOG_DIR ?? 'logs'
    const logLevel = process.env.LOG_LEVEL ?? 'debug'

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]${this.context ?? ''}: ${message}`
      })
    )

    const transports: winston.transport[] = []

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, `error-${environment}.log`),
        level: 'error',
        format: fileFormat
      }),
      new winston.transports.File({
        filename: path.join(logDir, `warn-${environment}.log`),
        level: 'warn',
        format: fileFormat
      }),
      new winston.transports.File({
        filename: path.join(logDir, `info-${environment}.log`),
        level: 'info',
        format: fileFormat
      }),
      new winston.transports.File({
        filename: path.join(logDir, `combined-${environment}.log`),
        format: fileFormat
      })
    )

    if (environment === 'dev') {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat
        })
      )
    }

    this.logger = winston.createLogger({
      level: logLevel,
      transports
    })
  }

  setContext(context: string) {
    this.context = context
  }

  log(message: string | object, trace?: string) {
    let formattedMessage: string

    if (typeof message === 'string') {
      formattedMessage = message
    } else {
      formattedMessage = JSON.stringify(message, null, 2)
      trace = (message as any)?.stack ?? trace
    }
    this.logger.info(`${formattedMessage} ${trace ?? ''}`)
  }

  error(message: string | object, trace?: string) {
    let formattedMessage: string

    if (typeof message === 'string') {
      formattedMessage = message
    } else {
      formattedMessage = JSON.stringify(message, null, 2)
      trace = (message as any)?.stack ?? trace
    }

    this.logger.error(`${formattedMessage} ${trace ?? ''}`)
  }

  warn(message: string | object, trace?: string) {
    let formattedMessage: string

    if (typeof message === 'string') {
      formattedMessage = message
    } else {
      formattedMessage = JSON.stringify(message, null, 2)
      trace = (message as any)?.stack ?? trace
    }
    this.logger.warn(`${formattedMessage} ${trace ?? ''}`)
  }

  debug(message: string | object, trace?: string) {
    let formattedMessage: string

    if (typeof message === 'string') {
      formattedMessage = message
    } else {
      formattedMessage = JSON.stringify(message, null, 2)
      trace = (message as any)?.stack ?? trace
    }
    this.logger.debug(`${formattedMessage} ${trace ?? ''}`)
  }

  verbose(message: string | object, trace?: string) {
    let formattedMessage: string

    if (typeof message === 'string') {
      formattedMessage = message
    } else {
      formattedMessage = JSON.stringify(message, null, 2)
      trace = (message as any)?.stack ?? trace
    }
    this.logger.verbose(`${formattedMessage} ${trace ?? ''}`)
  }
}
