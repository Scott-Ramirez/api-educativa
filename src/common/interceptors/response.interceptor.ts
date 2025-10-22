import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((original) => {
        // If original already matches { message, data } structure, adapt
        if (original && typeof original === 'object' && ('message' in original || 'data' in original)) {
          return { success: true, ...original };
        }

        // If original is an object with id and message, keep both
        if (original && typeof original === 'object') {
          return { success: true, data: original };
        }

        // For primitive responses
        return { success: true, data: original };
      }),
    );
  }
}
