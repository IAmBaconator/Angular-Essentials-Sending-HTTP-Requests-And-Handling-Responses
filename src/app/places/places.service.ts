import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  public hostUrl: string = 'https://automatic-fiesta-9r69p649qjg2x44q.github.dev/'; // Custom URL override of (http://localhost:3000/) for codespace that will need to be updated every time new npm start occurs.

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {}

  loadUserPlaces() {}

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}
}
