import React from 'react';
import { render } from '@testing-library/react';
import Brews from './Brews';

describe("Brews", () => {
  it("renders 3 divs", () => {
    const { container } = render(<Brews />);
    const brewElems = container.querySelectorAll(".brew");
    expect(brewElems.length).toEqual(3);
  });
});
