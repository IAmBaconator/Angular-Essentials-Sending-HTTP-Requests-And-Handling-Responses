import { Component, DestroyRef, inject, signal } from '@angular/core';

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
  isFetching = signal(false); // For displaying a message to the viewer while content loads.
  error = signal(''); // For handling any issues with the res.
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef); // Even thought the HttpClient requests tend to only return one request, it's good practise to include the DestryRef clean up the HttpClient subscripition.
  places = this.placesService.loadUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
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
}
