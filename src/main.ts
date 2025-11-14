import { bootstrapApplication } from '@angular/platform-browser';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { tap } from 'rxjs';

function loggingInterceptor(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn
) {
    // const req = request.clone({
    //     headers: request.headers.set('X-DEBUG', 'TESTING') //To change header value. This will error in the consol because the backend won't allow it but you can look at the network tab in DevTools
    // });
    console.log('[Outgoing Request]');
    console.log(request);
    //return next(req);
    return next(request).pipe(
        tap({ //Add reponse logging.
            next: event => {
                if (event.type === HttpEventType.Response) {
                    console.log('[Incoming Response]');
                    console.log(event.status);
                    console.log(event.body);
                }
            }
        })
    );

} //Function not class even though in older version of Angular you would set these up as classes.

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(withInterceptors([loggingInterceptor]))]//Register all the interceptor fuctions that should be executed by Angular for any outgoing req or incoming res.
}).catch((err) => console.error(err));
