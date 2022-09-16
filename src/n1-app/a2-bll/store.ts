import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk, {ThunkAction, ThunkDispatch } from "redux-thunk";
import {loginReducer} from "n1-app/a2-bll/b1-login-reducer";
import {registrationReducer} from "n1-app/a2-bll/b2-registration-reducer";
import {passwordRecoveryReducer} from "n1-app/a2-bll/b3-password-recovery-reducer";
import {changePasswordReducer} from "n1-app/a2-bll/b4-change-password-reducer";
import {profileReducer} from "n1-app/a2-bll/b5-profile-reducer";

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
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AllActionsType>

export type AllActionsType = {type: string}

// @ts-ignore
window.store = store