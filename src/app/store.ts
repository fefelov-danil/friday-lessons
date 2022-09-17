import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk, {ThunkDispatch} from "redux-thunk";
import {loginReducer} from "features/auth/login/login-reducer";
import {registrationReducer} from "features/auth/registration/registration-reducer";
import {passwordRecoveryReducer} from "features/auth/password-recovery/password-recovery-reducer";
import {changePasswordReducer} from "features/auth/change-password/change-password-reducer";
import {profileReducer} from "features/auth/profile/profile-reducer";

const rootReducer = combineReducers({
    login: loginReducer,
    registration: registrationReducer,
    passwordRecovery: passwordRecoveryReducer,
    changePassword: changePasswordReducer,
    profile: profileReducer
})

export type RootReducerType  = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AllActionsType>

export type AllActionsType = {type: string}

// @ts-ignore
window.store = store