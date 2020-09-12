import { BrewListState, BrewListAction, ADD_BREW_REQUESTED, ADD_BREW_SUCCEEDED, ADD_BREW_FAILED, FETCH_BREWS_REQUESTED, FETCH_BREWS_SUCCEEDED, FETCH_BREWS_FAILED } from "./types";

const initialState: BrewListState = {
    addBrew: {
        isRunning: false,
        error: null,
    },
    fetchBrews: {
        isRunning: false,
        error: null,
    },
    all: [],
};

export default function(
    state: BrewListState = initialState,
    action: BrewListAction
): BrewListState {
    switch (action.type) {
        case ADD_BREW_REQUESTED:
            return Object.assign({}, state, {
                addBrew: {
                    isRunning: true,
                    error: null,
                },
           });
        case ADD_BREW_SUCCEEDED:
            return Object.assign({}, state, {
                addBrew: {
                    isRunning: false,
                    error: null,
                },
            });
        case ADD_BREW_FAILED:
            return Object.assign({}, state, {
                addBrew: {
                    isRunning: false,
                    error: action.error,
                },
            });
        case FETCH_BREWS_REQUESTED:
            return Object.assign({}, state, {
                fetchBrews: {
                    isRunning: true,
                    error: null,
                },
            });
        case FETCH_BREWS_SUCCEEDED:
            return Object.assign({}, state, {
                fetchBrews: {
                    isRunning: false,
                    error: null,
                },
                all: action.brews,
            });
        case FETCH_BREWS_FAILED:
            return Object.assign({}, state, {
                fetchBrews: {
                    isRunning: false,
                    error: action.error,
                },
            });
        default:
            return state;
    };
};
