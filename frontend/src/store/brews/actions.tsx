import {
    FetchBrewsRequestedAction,
    FETCH_BREWS_REQUESTED,
    FetchBrewsSucceededAction,
    FETCH_BREWS_SUCCEEDED,
    FetchBrewsFailedAction,
    FETCH_BREWS_FAILED,
    DeleteBrewRequestedAction,
    DELETE_BREW_REQUESTED,
    DeleteBrewSucceededAction,
    DELETE_BREW_SUCCEEDED,
    DeleteBrewFailedAction,
    DELETE_BREW_FAILED,
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

export function deleteBrewRequested(brew: Brew): DeleteBrewRequestedAction {
    return {
        type: DELETE_BREW_REQUESTED,
        brew: brew,
    };
}

export function deleteBrewSucceeded(brew: Brew): DeleteBrewSucceededAction {
    return {
        type: DELETE_BREW_SUCCEEDED,
        brew: brew,
    };
}

export function deleteBrewFailed(error: any): DeleteBrewFailedAction {
    return {
        type: DELETE_BREW_FAILED,
        error: errorStringFromError(error),
    };
}

const errorStringFromError = (error: any): string => {
    if (error instanceof Error) {
        return error.message;
    } else {
        return String(error);
    }
};
