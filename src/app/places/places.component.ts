import { Component, input, output } from '@angular/core';

import { Place } from './place.model';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();
  hostUrl = 'https://congenial-goldfish-gjxqgxwq46jcwr5q-3000.app.github.dev/'; // Custom URL override of (http://localhost:3000/) for codespace that will need to be updated every time new npm start occurs.

  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }
}
