import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
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
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put(this.hostUrl + 'user-places', {
      placeId,
    });
  }

  removeUserPlace(place: Place) {}

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
