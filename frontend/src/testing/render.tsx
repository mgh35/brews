import React from 'react'
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { RootState } from 'store';

export default function(elem: React.ReactElement, initialState: RootState) {
    return render(<>
        <React.StrictMode>
            <Provider store={configureStore()(initialState)}>
                {elem}
            </Provider>
        </React.StrictMode>
    </>);
};
