import Brew from "models/Brew";

export const FETCH_BREWS_REQUESTED = "FETCH_BREWS_REQUESTED";
export const FETCH_BREWS_SUCCEEDED = "FETCH_BREWS_SUCCEEDED";
export const FETCH_BREWS_FAILED = "FETCH_BREWS_FAILED";

export interface FetchBrewsRequestedAction {
    type: typeof FETCH_BREWS_REQUESTED;
}

export interface FetchBrewsSucceededAction {
    type: typeof FETCH_BREWS_SUCCEEDED;
    brews: Brew[];
}

export interface FetchBrewsFailedAction {
    type: typeof FETCH_BREWS_FAILED;
    error: string;
}

export type BrewListAction =
    | FetchBrewsRequestedAction
    | FetchBrewsSucceededAction
    | FetchBrewsFailedAction;

interface FetchBrewsState {
    isRunning: boolean;
    error: string | null;
}

export interface BrewListState {
    fetchBrews: FetchBrewsState;
    all: Brew[];
}
