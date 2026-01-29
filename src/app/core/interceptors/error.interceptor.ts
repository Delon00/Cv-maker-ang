import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

// Si tu as un service de notification (ex: Toastr, PrimeNG MessageService), importe-le ici
// import { MessageService } from 'primeng/api'; 

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // const messageService = inject(MessageService); // Exemple d'injection

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur inconnue est survenue';

        if (error.error instanceof ErrorEvent) {
            // Erreur côté client (ex: réseau coupé)
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            // Erreur côté serveur (4xx, 5xx)
            if (error.error?.message) {
            // Si ton backend renvoie { message: "Email déjà pris" }
            errorMessage = error.error.message;
            } else {
            errorMessage = `Code: ${error.status}, Message: ${error.message}`;
            }
        }

        // 1. Logger l'erreur dans la console (ou un service de monitoring comme Sentry)
        console.error('🔴 [ErrorInterceptor]', errorMessage);

        // 2. (Optionnel) Afficher une notification visuelle à l'utilisateur
        // messageService.add({ severity: 'error', summary: 'Erreur', detail: errorMessage });
        // alert(errorMessage); // Pour tester si tu n'as pas de toast

        // 3. Propager l'erreur pour que le composant puisse arrêter le spinner (isLoading = false)
        return throwError(() => error);
        })
    );
};