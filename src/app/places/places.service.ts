import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from './place.model';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  hostUrl: string = 'http://automatic-fiesta-9r69p649qjg2x44q.github.dev/'; // Custom URL override of (http://localhost:3000/) for codespace that will need to be updated every time new npm start occurs.

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      this.hostUrl +'places',
      'Something went wrong when fetching the available places.  Please try again.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      this.hostUrl +'places',
      'Something went wrong when fetching your favorite places.  Please try again.'
    ).pipe(tap({
      next: (userPlaces) => this.userPlaces.set(userPlaces),
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();//doesn't setup a subscription, just reads the value.

    if (!prevPlaces.some((p) => p.id === place.id)) {//to check and ensure we do not have duplicate places added to our favorites.
      this.userPlaces.set(...prevPlaces, place);
    }
    
    return this.httpClient
      .put(this.hostUrl + 'user-places', {
        placeId: place.id,
      })
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlaces);//roll-back if an error takes place between the front/backend.
          this.errorService.showError('Failed to store selected place.');
          return throwError(() => new Error('Failed to store selected place.'));
        })
      );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();//doesn't setup a subscription, just reads the value.

    if (prevPlaces.some((p) => p.id === place.id)) {//to check and ensure we do not have duplicate places added to our favorites.
      this.userPlaces.set(prevPlaces.filter(p => p.id !== place.id));
    }

    return this.httpClient
    .delete(this.hostUrl + 'user-place' + place.id)
    .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to remove the selected place.');
          return throwError(
            () => new Error('Failed to remove the selected place.')
          );
        })
    );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{places: Place[]}>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
