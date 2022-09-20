import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { AppActionsType, appReducer } from 'app/app-reducer'
import { AuthActionsType, authReducer } from 'features/auth/auth-reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
})

export type RootReducerType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AllActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AllActionsType
>

export type AllActionsType = AuthActionsType | AppActionsType

// @ts-ignore
window.store = store
