import {
    FetchBrewsRequestedAction,
    FETCH_BREWS_REQUESTED,
    FetchBrewsSucceededAction,
    FETCH_BREWS_SUCCEEDED,
    FetchBrewsFailedAction,
    FETCH_BREWS_FAILED,
} from "./types";
import Brew from "models/Brew";

export function fetchBrewsRequested(): FetchBrewsRequestedAction {
    return {
        type: FETCH_BREWS_REQUESTED,
    };
}

export function fetchBrewsSucceeded(brews: Brew[]): FetchBrewsSucceededAction {
    return {
        type: FETCH_BREWS_SUCCEEDED,
        brews: brews,
    };
}

export function fetchBrewsFailed(error: string): FetchBrewsFailedAction {
    return {
        type: FETCH_BREWS_FAILED,
        error: error,
    };
}
