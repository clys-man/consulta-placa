interface Region {
  name: string;
  abbreviation: string;
}

export interface State {
  name: string;
  abbreviation: string;
  region: Region;
}

export interface PlateInfo {
  range: string;
  state?: State;
}
