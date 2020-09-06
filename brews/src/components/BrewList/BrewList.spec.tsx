import React from 'react';
import { render } from '@testing-library/react';

import Brew from 'models/brew';
import BrewList from '.';

import mockedQuery from 'test/mocks/libs/query';
import {mockUser} from 'test/mocks';


describe("BrewList", () => {
  it("renders divs for each Brew", () => {
    mockedQuery.userBrews.mockResolvedValue(
      [new Brew("a"), new Brew("b"), new Brew("c")]
    );
    const { container } = render(<BrewList user={mockUser()}/>);
    const brewElems = container.querySelectorAll(".brew");
    expect(brewElems.length).toEqual(3);
  });
});
