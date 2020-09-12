import {SWITCH_USER, AuthAction, PossibleUser } from './types';

export function switchUser(user: PossibleUser): AuthAction {
    return {
        type: SWITCH_USER,
        user: user
    }
};
