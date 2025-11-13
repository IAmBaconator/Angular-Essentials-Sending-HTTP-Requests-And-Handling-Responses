import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false); // For displaying a message to the viewer while content loads.
  error = signal(''); // For handling any issues with the res.
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef); // Even thought the HttpClient requests tend to only return one request, it's good practise to include the DestryRef clean up the HttpClient subscripition.

  constructor(private placesService: PlacesService) {}
  

    ngOnInit() {
      this.isFetching.set(true);
      const subscription = this.httpClient
        .get<{places: Place[] }>(this.placesService.hostUrl + 'user-places')
        .pipe(
          map((resData) => resData.places),
          catchError((error) => {
            console.log(error);
            return throwError(
              () => 
                new Error(
                  'Something went wrong fetching your favorite places. Please try again later.'
                )
              );
         }) // Not necessary, but for demo purposes.
        )
        .subscribe({
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
      this.httpClient.put(this.placesService.hostUrl, {
        placeId: selectedPlace.id
      }).subscribe({
        next: (resData) => console.log(resData),
      });
    }
  }
}
