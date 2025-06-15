import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import * as L from "leaflet";
import { Location, LocationsService } from "./services/locations.service";

@Component({
  selector: "app-root",
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: true,
})
export class AppComponent implements OnInit {
  private map!: L.Map;
  private polylines: Record<string, L.Polyline> = {};
  private markers: L.Marker[] = [];
  private deviceColors: Record<string, string> = {};
  private readonly colorPalette = [
    "#FF4081", // Pink
    "#3F51B5", // Indigo
    "#009688", // Teal
    "#FF5722", // Deep Orange
    "#9C27B0", // Purple
    "#673AB7", // Deep Purple
    "#4CAF50", // Green
    "#FF9800", // Orange
    "#795548", // Brown
    "#607D8B", // Blue Grey
    "#E91E63", // Pink (different shade)
    "#2196F3", // Blue
  ];

  public locations = signal<Record<string, Location[]>>({});
  public isGroupOpened = signal<Record<string, boolean>>({});
  public isLegendOpen = signal<boolean>(false);

  constructor(private locationsService: LocationsService) {}

  ngOnInit(): void {
    // Initialize map after view is ready
    setTimeout(() => {
      this.map = L.map("map").setView([48.8566, 2.3522], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: " OpenStreetMap contributors",
      }).addTo(this.map);

      this.locationsService.getLocations().subscribe((locations) => {
        this.locations.set(this.groupBySerialNumber(locations));
        Object.entries(this.locations()).forEach(
          ([serialNumber, locations]) => {
            this.addLocationToMap(serialNumber, locations);
          }
        );
      });
    }, 100);
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

    // Get or assign color for this device
    const deviceColor = this.getDeviceColor(name);

    locations.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    locations.forEach((location) => {
      const latLng: L.LatLngExpression = [
        location.locationlatitude!,
        location.locationlongitude!,
      ];

      // Create custom colored icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 15px;
          height: 15px;
          background-color: ${deviceColor};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [15, 15],
        iconAnchor: [7, 7],
      });

      const marker = L.marker(latLng, {
        icon: customIcon,
      }).bindPopup(`
          <h3>${location.name || "Unknown Device"}</h3>
          <p>${location.datetime}</p>
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
      // Remove existing polyline for this device if it exists
      if (this.polylines[name]) {
        this.polylines[name].remove();
      }

      this.polylines[name] = L.polyline(coordinates, {
        color: deviceColor,
        weight: 3,
        opacity: 0.7,
      }).addTo(this.map);

      // Fit bounds to show all devices
      this.fitBoundsToAllDevices();
    }
  }

  private getDeviceColor(serialNumber: string): string {
    if (!this.deviceColors[serialNumber]) {
      const colorIndex =
        Object.keys(this.deviceColors).length % this.colorPalette.length;
      this.deviceColors[serialNumber] = this.colorPalette[colorIndex];
    }
    return this.deviceColors[serialNumber];
  }

  private fitBoundsToAllDevices(): void {
    const allPolylines = Object.values(this.polylines);
    if (allPolylines.length > 0) {
      const group = new L.FeatureGroup(allPolylines);
      this.map.fitBounds(group.getBounds());
    }
  }

  public getDeviceColorForLegend(serialNumber: string): string {
    return this.getDeviceColor(serialNumber);
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

  public toggleLegend(): void {
    this.isLegendOpen.set(!this.isLegendOpen());
    // Trigger map resize after panel animation completes
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }
}
