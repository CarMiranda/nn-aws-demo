import { createSlice } from "@reduxjs/toolkit"

export enum AWSRegion {
  EuNorth1 = "eu-north-1",
  USWest1 = "us-west-1",
  USEast1 = "us-east-1",
}

export interface AWSSettings {
  appSubdomain: string,
  region: AWSRegion
  path: string,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: {appSubdomain: "2efg891u1g", region: AWSRegion.EuNorth1, path: "prod"},
  reducers: {
    settingsUpdated(state, action) {
      state.appSubdomain = action.payload.appSubdomain;
      state.region = action.payload.region;
      state.path = action.payload.path;
    }
  }
});

export const { settingsUpdated } = settingsSlice.actions;
export default settingsSlice.reducer;

