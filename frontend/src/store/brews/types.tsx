import Brew from "models/Brew";

export const FETCH_BREWS_REQUESTED = "FETCH_BREWS_REQUESTED";
export const FETCH_BREWS_SUCCEEDED = "FETCH_BREWS_SUCCEEDED";
export const FETCH_BREWS_FAILED = "FETCH_BREWS_FAILED";
export const DELETE_BREW_REQUESTED = "DELETE_BREW_REQUESTED";
export const DELETE_BREW_SUCCEEDED = "DELETE_BREW_SUCCEEDED";
export const DELETE_BREW_FAILED = "DELETE_BREW_FAILED";

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

export interface DeleteBrewRequestedAction {
    type: typeof DELETE_BREW_REQUESTED;
    brew: Brew;
}

export interface DeleteBrewSucceededAction {
    type: typeof DELETE_BREW_SUCCEEDED;
    brew: Brew;
}

export interface DeleteBrewFailedAction {
    type: typeof DELETE_BREW_FAILED;
    error: string;
}

export type BrewListAction =
    | FetchBrewsRequestedAction
    | FetchBrewsSucceededAction
    | FetchBrewsFailedAction
    | DeleteBrewRequestedAction
    | DeleteBrewSucceededAction
    | DeleteBrewFailedAction;

export interface BrewsState {
    idToBrew: { [Key: string]: Brew };
    isFetching: boolean;
    errorFetching: string | null;
    isDeleting: boolean;
    errorDeleting: string | null;
    list_by_most_recent: Array<string>;
}
