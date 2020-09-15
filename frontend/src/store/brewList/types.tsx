import Brew from "models/Brew";

export const ADD_BREW_REQUESTED = "ADD_BREW_REQUESTED";
export const ADD_BREW_SUCCEEDED = "ADD_BREW_SUCCEEDED";
export const ADD_BREW_FAILED = "ADD_BREW_FAILED";
export const FETCH_BREWS_REQUESTED = "FETCH_BREWS_REQUESTED";
export const FETCH_BREWS_SUCCEEDED = "FETCH_BREWS_SUCCEEDED";
export const FETCH_BREWS_FAILED = "FETCH_BREWS_FAILED";

export interface AddBrewRequestedAction {
  type: typeof ADD_BREW_REQUESTED;
  brew: Brew;
}

export interface AddBrewSucceededAction {
  type: typeof ADD_BREW_SUCCEEDED;
}

export interface AddBrewFailedAction {
  type: typeof ADD_BREW_FAILED;
  error: string;
}

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
  | AddBrewRequestedAction
  | AddBrewSucceededAction
  | AddBrewFailedAction
  | FetchBrewsRequestedAction
  | FetchBrewsSucceededAction
  | FetchBrewsFailedAction;

interface AddBrewState {
  isRunning: boolean;
  error: string | null;
}

interface FetchBrewsState {
  isRunning: boolean;
  error: string | null;
}

export interface BrewListState {
  addBrew: AddBrewState;
  fetchBrews: FetchBrewsState;
  all: Brew[];
}
