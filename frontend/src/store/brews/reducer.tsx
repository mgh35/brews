import {
    BrewsState,
    BrewsAction,
    FETCH_BREWS_REQUESTED,
    FETCH_BREWS_SUCCEEDED,
    FETCH_BREWS_FAILED,
    DELETE_BREW_REQUESTED,
    DELETE_BREW_SUCCEEDED,
    DELETE_BREW_FAILED,
} from "./types";
import Brew from "models/Brew";

const initialState: BrewsState = {
    isFetching: false,
    errorFetching: null,
    isDeleting: false,
    errorDeleting: null,
    idToBrew: {},
    list_by_most_recent: [],
};

export default function (
    state: BrewsState = initialState,
    action: BrewsAction
): BrewsState {
    switch (action.type) {
        case FETCH_BREWS_REQUESTED:
            return {
                ...state,
                isFetching: true,
                errorFetching: null,
            };
        case FETCH_BREWS_SUCCEEDED:
            const byMostRecentTimestamp = (a: Brew, b: Brew) => {
                if (a.timestamp === b.timestamp) {
                    return 0;
                } else if (a.timestamp === null) {
                    return 1;
                } else if (b.timestamp === null) {
                    return -1;
                } else if (a.timestamp > b.timestamp) {
                    return -1;
                } else if (a.timestamp < b.timestamp) {
                    return 1;
                } else {
                    return 0;
                }
            };
            return {
                ...state,
                isFetching: false,
                errorFetching: null,
                idToBrew: {
                    ...state.idToBrew,
                    ...Object.fromEntries(
                        action.brews.map((brew) => [brew.id, brew])
                    ),
                },
                list_by_most_recent: action.brews
                    .sort(byMostRecentTimestamp)
                    .map((brew) => brew.id),
            };
        case FETCH_BREWS_FAILED:
            return {
                ...state,
                isFetching: false,
                errorFetching: action.error,
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
                list_by_most_recent: state.list_by_most_recent.filter(
                    (brewId) => brewId !== action.brew.id
                ),
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
