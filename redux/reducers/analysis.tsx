import { createSlice } from "@reduxjs/toolkit"

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {kind: "ocr", image: {data: "", height: 0, width: 0}, results: []},
  reducers: {
    kindSet(state, action) {
      state.kind = action.payload.kind;
    },
    imageSet(state, action) {
      state.image = action.payload.image;
    },
    imageDeleted(state, action) {
      state.image = {data: "", height: 0, width: 0};
    },
    resultsSet(state, action) {
      state.results = action.payload.results;
    },
    analysisEnded(state, action) {
      state.kind = "";
      state.image = {data: "", height: 0, width: 0};
      state.results = [];
    }
  }
});

export const { kindSet, imageSet, imageDeleted, resultsSet, analysisEnded } = analysisSlice.actions;
export default analysisSlice.reducer;

