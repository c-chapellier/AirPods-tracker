import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import * as L from "leaflet";
import { Location, LocationsService } from "./services/locations.service";

@Component({
  selector: "app-root",
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent {
  private map!: L.Map;
  private polyline!: L.Polyline;
  private markers: L.Marker[] = [];
  public locations = signal<Record<string, Location[]>>({});
  public isGroupOpened = signal<Record<string, boolean>>({});

  constructor(private locationsService: LocationsService) {}

  ngOnInit(): void {
    this.map = L.map("map").setView([48.8566, 2.3522], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: " OpenStreetMap contributors",
    }).addTo(this.map);

    this.locationsService.getLocations().subscribe((locations) => {
      this.locations.set(this.groupBySerialNumber(locations));
      Object.entries(this.locations()).forEach(([serialNumber, locations]) => {
        this.addLocationToMap(serialNumber, locations);
      });
    });
  }

  public groupBySerialNumber(locations: Location[]): {
    [key: string]: Location[];
  } {
    return locations.reduce(
      (groups: { [key: string]: Location[] }, location) => {
        const serialNumber = location.serialnumber || "Unknown";
        if (!groups[serialNumber]) {
          groups[serialNumber] = [];
        }
        groups[serialNumber].push(location);
        return groups;
      },
      {}
    );
  }

  private addLocationToMap(name: string, locations: Location[]): void {
    if (locations.length === 0) return;

    locations.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    locations.forEach((location) => {
      const latLng: L.LatLngExpression = [
        location.locationlatitude!,
        location.locationlongitude!,
      ];
      const marker = L.marker(latLng, {
        icon: L.icon({
          iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          iconSize: [15, 15],
          iconAnchor: [7, 7],
        }),
      }).bindPopup(`
          <h3>${location.name || "Unknown Device"}</h3>
          <p>${new Date(location.datetime).toLocaleString()}</p>
          <p>${location.addressstreetaddress}, ${location.addresslocality}</p>
        `);

      this.markers.push(marker);
      marker.addTo(this.map);
    });

    const coordinates = locations
      .filter((loc) => loc.locationlatitude && loc.locationlongitude)
      .map(
        (loc) =>
          [loc.locationlatitude, loc.locationlongitude] as [number, number]
      );

    if (coordinates.length > 1) {
      if (this.polyline) {
        this.polyline.remove();
      }
      this.polyline = L.polyline(coordinates, {
        color: this.getRandomColor(),
        weight: 3,
        opacity: 0.7,
      }).addTo(this.map);
      this.map.fitBounds(this.polyline.getBounds());
    }
  }

  private getRandomColor(): string {
    const colors = [
      "#FF4081",
      "#3F51B5",
      "#009688",
      "#FF5722",
      "#9C27B0",
      "#673AB7",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public onLocationGroupClick(serialNumber: string): void {
    console.log(
      `Clicked on location group with serial number: ${serialNumber}`
    );
    this.isGroupOpened.set({
      ...this.isGroupOpened(),
      [serialNumber]: !this.isGroupOpened()[serialNumber],
    });
  }
}
