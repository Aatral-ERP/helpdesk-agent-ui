import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpHeaders,
    HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(private tst: ToastrService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            headers: this.createTokenHeader()
        });
        // if (!environment.production)
        // console.log(req);
        return next.handle(req).pipe(tap(event => {
            event;
            if (event instanceof HttpResponse) {
                // if (!environment.production)
                // console.log(event);
            }
        }, error => this.handleError(error)));
    }

    private handleError(event: HttpEvent<any>): HttpEvent<any> {
        if (event instanceof HttpErrorResponse) {
            const error = <HttpErrorResponse>event;
            console.error(error);
            if (error.status == 401) {
                localStorage.clear();
                window.location.href = "./";
            } else if (error.status == 0) {
                this.tst.error(error.statusText);
            }
        }
        return event;
    }

    private createTokenHeader(): HttpHeaders {
        const token = localStorage.getItem('token');
        let reqOptions = new HttpHeaders();

        reqOptions = reqOptions.set('Access-Control-Allow-Credentials', 'true');
        // reqOptions = reqOptions.set('Content-Type', 'application/json');
        reqOptions = reqOptions.set('Access-Control-Allow-Origin', "*");
        reqOptions = reqOptions.set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
        reqOptions = reqOptions.set('Access-Control-Expose-Headers', "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        reqOptions = reqOptions.set('Access-Control-Allow-Headers', `*`);
        if (token) {
            reqOptions = reqOptions.set('Authorization', `${token}`);
        }
        return reqOptions;
    }

}