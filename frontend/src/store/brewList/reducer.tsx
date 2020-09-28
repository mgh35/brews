import {
    BrewListState,
    BrewListAction,
    FETCH_BREWS_REQUESTED,
    FETCH_BREWS_SUCCEEDED,
    FETCH_BREWS_FAILED,
    DELETE_BREW_REQUESTED,
    DELETE_BREW_SUCCEEDED,
    DELETE_BREW_FAILED,
} from "./types";

const initialState: BrewListState = {
    fetchBrews: {
        isRunning: false,
        error: null,
    },
    isDeleting: false,
    errorDeleting: null,
    all: [],
};

export default function (
    state: BrewListState = initialState,
    action: BrewListAction
): BrewListState {
    switch (action.type) {
        case FETCH_BREWS_REQUESTED:
            return {
                ...state,
                fetchBrews: {
                    isRunning: true,
                    error: null,
                },
            };
        case FETCH_BREWS_SUCCEEDED:
            return {
                ...state,
                fetchBrews: {
                    isRunning: false,
                    error: null,
                },
                all: action.brews,
            };
        case FETCH_BREWS_FAILED:
            return {
                ...state,
                fetchBrews: {
                    isRunning: false,
                    error: action.error,
                },
            };
        case DELETE_BREW_REQUESTED:
            return {
                ...state,
                isDeleting: true,
                errorDeleting: null,
            };
        case DELETE_BREW_SUCCEEDED:
            return {
                ...state,
                isDeleting: false,
                errorDeleting: null,
                all: state.all.filter((brew) => brew.id !== action.brew.id),
            };
        case DELETE_BREW_FAILED:
            return {
                ...state,
                isDeleting: false,
                errorDeleting: action.error,
            };
        default:
            return state;
    }
}
