import React from "react";
import render from "testing/render";
import { UnauthedApp } from "components/App";
import { StateBuilder } from "testing/state";

describe("App", () => {
  let appElem: HTMLElement;
  beforeAll(() => {
    const { container } = render(<UnauthedApp />, new StateBuilder().build());
    appElem = container;
  });
  it("renders", () => {
    expect(appElem).toBeDefined();
  });

  it("has Header element", () => {
    expect(appElem.querySelector("Header")).toBeDefined();
  });

  it("has AddBrew element", () => {
    expect(appElem.querySelector("BrewInputPanel")).toBeDefined();
  });

  it("has BrewList element", () => {
    expect(appElem.querySelector("BrewList")).toBeDefined();
  });
});
