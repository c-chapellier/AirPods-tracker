import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AirTag } from '../../interfaces/airtag.interface';
import { AirTagsService } from '../../services/todos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private map!: L.Map;
  private polyline?: L.Polyline;

  constructor(private airTagsService: AirTagsService) {
    // Create a transparent icon
    const transparentIcon = L.divIcon({
      className: 'transparent-icon',
      iconSize: [1, 1]
    });
    L.Marker.prototype.options.icon = transparentIcon;
  }

  ngOnInit() {
    this.initMap();
    this.loadAirTags();
  }

  private initMap(): void {
    this.map = L.map('map').setView([49.582522, 5.589455], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadAirTags(): void {
    this.airTagsService.getAirTags().subscribe({
      next: (response) => {
        this.clearMap();

        const airTagGroups = this.groupByName(response.locations);

        Object.entries(airTagGroups).forEach(([name, locations]) => {
          this.addAirTagToMap(name, locations);
        });

        if (this.polyline) {
          this.map.fitBounds(this.polyline.getBounds());
        }
      },
      error: (error) => {
        console.error('Error loading AirTags:', error);
      }
    });
  }

  private groupByName(locations: AirTag[]): { [key: string]: AirTag[] } {
    return locations.reduce((groups: { [key: string]: AirTag[] }, location) => {
      const name = location.name || 'Unknown';
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(location);
      return groups;
    }, {});
  }

  private addAirTagToMap(name: string, locations: AirTag[]): void {
    if (locations.length === 0) return;

    locations.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    const coordinates = locations
      .filter(loc => loc.locationlatitude && loc.locationlongitude)
      .map(loc => [loc.locationlatitude, loc.locationlongitude] as [number, number]);

    if (coordinates.length > 1) {
      this.polyline = L.polyline(coordinates, {
        color: this.getRandomColor(),
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);
    }
  }

  private clearMap(): void {
    if (this.polyline) {
      this.polyline.remove();
    }
  }

  private getRandomColor(): string {
    const colors = ['#FF4081', '#3F51B5', '#009688', '#FF5722', '#9C27B0', '#673AB7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
