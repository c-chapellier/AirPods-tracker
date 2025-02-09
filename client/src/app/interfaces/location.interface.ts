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
