from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Location(BaseModel):
    datetime: datetime
    name: Optional[str] = None
    serialnumber: Optional[str] = None
    producttype: Optional[str] = None
    batterystatus: Optional[int] = None
    locationlatitude: Optional[float] = None
    locationlongitude: Optional[float] = None
    locationtimestamp: Optional[datetime] = None
    locationhorizontalaccuracy: Optional[float] = None
    locationverticalaccuracy: Optional[float] = None
    addresslabel: Optional[str] = None
    addressstreetaddress: Optional[str] = None
    addresslocality: Optional[str] = None
    addresscountry: Optional[str] = None
