import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import locations from "../../assets/scrapped_data.csv";

export interface Location {
  datetime: string;
  name: string | null;
  serialnumber: string | null;
  producttype: string | null;
  batterystatus: number | null;
  locationlatitude: number | null;
  locationlongitude: number | null;
  locationtimestamp: string | null;
  locationhorizontalaccuracy: number | null;
  locationverticalaccuracy: number | null;
  addresslabel: string | null;
  addressstreetaddress: string | null;
  addresslocality: string | null;
  addresscountry: string | null;
}

@Injectable({
  providedIn: "root",
})
export class LocationsService {
  constructor() {}

  getLocations(): Observable<Location[]> {
    // parse the CSV data into an array of Location objects
    // datetime,name,serialnumber,producttype,productindentifier,vendoridentifier,antennapower,systemversion,batterystatus,locationpositiontype,locationlatitude,locationlongitude,locationtimestamp,locationverticalaccuracy,locationhorizontalaccuracy,locationfloorlevel,locationaltitude,locationisinaccurate,locationisold,locationfinished,addresslabel,addressstreetaddress,addresscountrycode,addressstatecode,addressadministrativearea,addressstreetname,addresslocality,addresscountry,addressareaofinteresta,addressareaofinterestb
    // 2025-06-15  18:19:16,"Corentin’s Wallet","HGPNJ0GLP0GV","b389",21760,76,4,"2.0.73",1,"ownedDeviceLocation",49.552739300011496,5.5201909998774195,1749994288000,-1,35.807704482400709,0,-1,"false","true","true","Rue du Stade 5","5","BE","","Luxemburg","Rue du Stade","Virton","Belgium","",""
    // 2025-06-15  18:19:17,"Blanc","HGPNJ0GQP0GV","b389",21760,76,4,"2.0.73",1,"lastConnected",49.582530969794718,5.5894734796612635,1750004341503,-1,35,0,-1,"false","false","true","Rue des Acacias 49","49","BE","","Luxemburg","Rue des Acacias","Virton","Belgium","",""
    // 2025-06-15  18:19:17,"Right Bud","H5RGDHJC0360","hawkeye",8211,76,4,"101.1.80",1,"lastConnected",49.582530969794718,5.5894734796612635,1750004341503,-1,35,0,-1,"false","false","true","Rue des Acacias 49","49","BE","","Luxemburg","Rue des Acacias","Virton","Belgium","",""

    const locs: Location[] = locations
      .split("\n")
      .slice(1) // Skip header
      .map((line) => {
        // console.log("Parsing line:", line);
        if (!line.trim()) {
          return null; // Skip empty lines
        }
        const [
          datetime,
          name,
          serialnumber,
          producttype,
          productindentifier,
          vendoridentifier,
          antennapower,
          systemversion,
          batterystatus,
          locationpositiontype,
          locationlatitude,
          locationlongitude,
          locationtimestamp,
          locationverticalaccuracy,
          locationhorizontalaccuracy,
          locationfloorlevel,
          locationaltitude,
          locationisinaccurate,
          locationisold,
          locationfinished,
          addresslabel,
          addressstreetaddress,
          addresscountrycode,
          addressstatecode,
          addressadministrativearea,
          addressstreetname,
          addresslocality,
          addresscountry,
          addressareaofinteresta,
          addressareaofinterestb,
        ] = line.split(",");

        return {
          datetime: datetime.trim(),
          name: name.trim() || null,
          serialnumber: serialnumber.trim() || null,
          producttype: producttype.trim() || null,
          batterystatus: batterystatus ? parseInt(batterystatus, 10) : null,
          locationlatitude: locationlatitude
            ? parseFloat(locationlatitude)
            : null,
          locationlongitude: locationlongitude
            ? parseFloat(locationlongitude)
            : null,
          locationtimestamp: locationtimestamp.trim() || null,
          locationhorizontalaccuracy: locationhorizontalaccuracy
            ? parseFloat(locationhorizontalaccuracy)
            : null,
          locationverticalaccuracy: locationverticalaccuracy
            ? parseFloat(locationverticalaccuracy)
            : null,
          addresslabel: addresslabel.trim() || null,
          addressstreetaddress: addressstreetaddress.trim() || null,
          addresslocality: addresslocality.trim() || null,
          addresscountry: addresscountry.trim() || null,
        };
      })
      .filter((loc) => loc !== null);

    return of(locs);
  }
}
