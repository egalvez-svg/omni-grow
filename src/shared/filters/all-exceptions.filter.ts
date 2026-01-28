import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common'

import { Request, Response } from 'express'

import { LoggerService } from '../../logger/logger.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    const stack = (exception as any)?.stack ?? ''
    const timestamp = new Date().toISOString()
    const method = request.method
    const path = request.url
    const environment = process.env.NODE_ENV ?? 'dev'

    const logPayload: Record<string, any> = {
      timestamp,
      method,
      path,
      status,
      message: errorResponse,
      stack
    }

    if (environment !== 'prod') {
      logPayload.headers = request.headers
      logPayload.body = request.body
    }

    const log = JSON.stringify(logPayload, null, 2)
    if (status >= 500) {
      this.logger.error(log)
    } else if (status >= 400) {
      this.logger.warn(log)
    } else {
      this.logger.log(log)
    }

    response.status(status).json({
      statusCode: status,
      timestamp,
      path,
      ...(environment !== 'prod' ? { message: errorResponse } : {})
    })
  }
}
