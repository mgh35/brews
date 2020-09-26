import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore, { MockStore } from "redux-mock-store";
import { RootState } from "store";

export type MockStoreType = MockStore<RootState>;

export default function (elem: React.ReactElement, initialState: RootState) {
  const store = configureStore<RootState>()(initialState);
  return {
    store: store,
    rendered: render(
      <>
        <React.StrictMode>
          <Provider store={store}>{elem}</Provider>
        </React.StrictMode>
      </>
    ),
  };
}
