import React from 'react';
import render from 'testing/render';
import App from 'components/App';
import Brew from 'models/Brew';
import { RenderResult } from '@testing-library/react';

describe('BrewList', () => {
    describe('with no brews', () => {
        let rendered: RenderResult;
        beforeEach(() => {
            rendered = render(<App />, {
                brewList: {
                    all: []
                }
            });
        });

        it('has a single table', () => {
            const tables = rendered.container.querySelectorAll("table");
            expect(tables.length).toEqual(1);
        });

        it('has no rows', () => {
            const rows = rendered.container.querySelectorAll("table tr")
            expect(rows.length).toEqual(0);
        });
    });

    describe('with 2 brews', () => {
        let rendered: RenderResult;
        beforeEach(() => {
            rendered = render(<App />, {
                brewList: {
                    all: [
                        new Brew('2020-09-06T09:00:00+0000', 'brew 1'),
                        new Brew('2020-09-06T09:05:00+0000', 'brew 2'),
                    ]
                }
            });
        });

        it('has a single table', () => {
            const tables = rendered.container.querySelectorAll("table");
            expect(tables.length).toEqual(1);
        });

        it('has 2 rows', () => {
            const rows = rendered.container.querySelectorAll("table tr")
            expect(rows.length).toEqual(2);
        });

    });
});
