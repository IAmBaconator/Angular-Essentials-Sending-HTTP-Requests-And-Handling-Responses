import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  public hostUrl: string = 'https://congenial-goldfish-gjxqgxwq46jcwr5q-3000.app.github.dev/'; // Custom URL override of (http://localhost:3000/) for codespace that will need to be updated every time new npm start occurs.

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {}

  loadUserPlaces() {}

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}
}
