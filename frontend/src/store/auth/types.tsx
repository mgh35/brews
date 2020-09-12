import User from 'models/User';

export const SWITCH_USER = 'SWITCH_USER';

export type PossibleUser = User | null

interface SwitchUserAction {
    type: typeof SWITCH_USER,
    user: PossibleUser
};

export type AuthAction = SwitchUserAction;

export interface AuthState {
    user: PossibleUser
};
