import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef); // Even thought the HttpClient requests tend to only return one request, it's good practise to include the DestryRef clean up the HttpClient subscripition.

// Alternative method of connecting to the HttpClient.
// constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    const subscription = this.httpClient
      .get<{places: Place[]}>('https://congenial-goldfish-gjxqgxwq46jcwr5q-3000.app.github.dev/places')
      .subscribe({
        next: (resData) => {
          //console.log('httpClient Connected!');
          console.log(resData.places);
        },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

