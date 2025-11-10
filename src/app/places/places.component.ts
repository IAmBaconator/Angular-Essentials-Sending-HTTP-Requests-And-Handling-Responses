import { Component, input, output } from '@angular/core';

import { Place } from './place.model';
import { PlacesService } from './places.service';

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

  constructor(private placesService: PlacesService) {}
  hostUrl = this.placesService.hostUrl;
  
  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }
}
