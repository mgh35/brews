import React from "react";
import render from "testing/render";
import { UnauthedApp } from "components/App";
import { StateBuilder } from "testing/state";

describe("App", () => {
  let appElem: HTMLElement;
  beforeAll(() => {
    const { rendered } = render(<UnauthedApp />, new StateBuilder().build());
    appElem = rendered.container;
  });
  it("renders", () => {
    expect(appElem).toBeDefined();
  });

  it("has Header element", () => {
    expect(appElem.querySelector("Header")).toBeDefined();
  });

  it("does not have BrewInputPanel element", () => {
    expect(appElem.querySelector("BrewInputPanel")).toBeNull();
  });

  it("does not BrewList element", () => {
    expect(appElem.querySelector("BrewList")).toBeNull();
  });
});
