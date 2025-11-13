import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false); // For displaying a message to the viewer while content loads.
  error = signal(''); // For handling any issues with the res.
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef); // Even thought the HttpClient requests tend to only return one request, it's good practise to include the DestryRef clean up the HttpClient subscripition.

// Alternative method of connecting to the HttpClient.
// constructor(private httpClient: HttpClient) {}
 
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = 
      this.placesService.loadAvailablePlaces().subscribe({
        next: (places) => {
          //console.log('httpClient Connected!');
          //console.log(event);
          //console.log(resData.places); // Modify the response to reflect the added observ parameer above and add a "?" to support undefined inititally.
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => { // Safest route to use in case multiple requets need to complete before this is set.
          this.isFetching.set(false);
        }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData) => console.log(resData),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

