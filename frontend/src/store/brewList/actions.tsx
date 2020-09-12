import {ADD_BREW_REQUESTED, AddBrewRequestedAction, AddBrewSucceededAction, ADD_BREW_SUCCEEDED, AddBrewFailedAction, ADD_BREW_FAILED, FetchBrewsRequestedAction, FETCH_BREWS_REQUESTED, FetchBrewsSucceededAction, FETCH_BREWS_SUCCEEDED, FetchBrewsFailedAction, FETCH_BREWS_FAILED} from './types';
import Brew from 'models/Brew';

export function addBrewRequested(brew: Brew): AddBrewRequestedAction {
    return {
        type: ADD_BREW_REQUESTED,
        brew: brew,
    }
};

export function addBrewSucceeded(): AddBrewSucceededAction {
    return {
        type: ADD_BREW_SUCCEEDED,
    }
};

export function addBrewFailed(error: string): AddBrewFailedAction {
    return {
        type: ADD_BREW_FAILED,
        error: error,
    }
};

export function fetchBrewsRequested(): FetchBrewsRequestedAction {
    return {
        type: FETCH_BREWS_REQUESTED
    }
};

export function fetchBrewsSucceeded(brews: Brew[]): FetchBrewsSucceededAction {
    return {
        type: FETCH_BREWS_SUCCEEDED,
        brews: brews
    }
};

export function fetchBrewsFailed(error: string): FetchBrewsFailedAction {
    return {
        type: FETCH_BREWS_FAILED,
        error: error
    }
};
