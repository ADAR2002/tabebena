import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const response = error.getResponse();
          const status = error.getStatus();

          return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  data: {
                    statusCode: status,
                    message:
                      typeof response === "string"
                        ? response
                        : (response as any).message || error.message,
                    error: (response as any).error || error.name,
                  },
                },
                status
              )
          );
        }

        return throwError(
            () =>
              new HttpException(
                {
                  success: false,
                  data: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message || "Internal server error",
                    error: "InternalServerError"
                  },
                },
                HttpStatus.INTERNAL_SERVER_ERROR
              )
          );
      })
    );
  }
}
