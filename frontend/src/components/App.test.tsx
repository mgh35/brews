import React from 'react';
import render from 'testing/render';
import App from 'components/App';

describe('App', () => {
  it('can be rendered', () => {
    const { container } = render(<App />,
      {
        brewList: {
          all: []
        }
      }
    );
    expect(container).toBeDefined();
  });
});
