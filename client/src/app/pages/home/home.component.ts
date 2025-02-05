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
  private markers: L.Marker[] = [];
  private polyline?: L.Polyline;
  private readonly iconSize: L.PointExpression = [25, 25];
  private readonly iconAnchor: L.PointExpression = [12, 12];
  private readonly popupAnchor: L.PointExpression = [0, -10];

  private icons = {
    default: L.icon({
      iconUrl: 'assets/icons/airtag.png',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      popupAnchor: this.popupAnchor
    }),
    keys: L.icon({
      iconUrl: 'assets/icons/keys.png',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      popupAnchor: this.popupAnchor
    }),
    wallet: L.icon({
      iconUrl: 'assets/icons/wallet.png',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      popupAnchor: this.popupAnchor
    }),
    car: L.icon({
      iconUrl: 'assets/icons/car.png',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      popupAnchor: this.popupAnchor
    }),
    airpods: L.icon({
      iconUrl: 'assets/icons/airpods.png',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      popupAnchor: this.popupAnchor
    })
  };

  constructor(private airTagsService: AirTagsService) {
    // Fix Leaflet default icon issue
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
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
        if (this.markers.length > 0) {
          const group = L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds());
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

  private getIconForAirTag(name: string): L.Icon {
    const nameLower = name.toLowerCase();
    // if (nameLower.includes('keys')) return this.icons.keys;
    // if (nameLower.includes('wallet')) return this.icons.wallet;
    // if (nameLower.includes('car')) return this.icons.car;
    // if (nameLower.includes('bud') || nameLower.includes('airpod')) return this.icons.airpods;
    return this.icons.default;
  }

  private addAirTagToMap(name: string, locations: AirTag[]): void {
    if (locations.length === 0) return;

    locations.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    locations.forEach(location => {
      if (location.locationlatitude && location.locationlongitude) {
        const marker = L.marker(
          [location.locationlatitude, location.locationlongitude],
          { icon: this.getIconForAirTag(name) }
        ).bindPopup(`
          <strong>${name}</strong><br>
          Time: ${new Date(location.datetime).toLocaleString()}<br>
          Battery: ${location.batterystatus}%<br>
          Address: ${location.addresslabel || 'Unknown'}<br>
          ${location.addresslocality ? location.addresslocality + ', ' : ''}${location.addresscountry || ''}
        `);
        marker.addTo(this.map);
        this.markers.push(marker);
      }
    });

    const coordinates = locations
      .filter(loc => loc.locationlatitude && loc.locationlongitude)
      .map(loc => [loc.locationlatitude, loc.locationlongitude] as [number, number]);

    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates, {
        color: this.getRandomColor(),
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);
    }
  }

  private clearMap(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    if (this.polyline) {
      this.polyline.remove();
    }
  }

  private getRandomColor(): string {
    const colors = ['#FF4081', '#3F51B5', '#009688', '#FF5722', '#9C27B0', '#673AB7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
