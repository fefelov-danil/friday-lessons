import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import { cardsReducer } from '../features/cards/cards-reducer'
import { packsReducer } from '../features/packs/packs-reducer'
import { usersReducer } from '../features/users/users-reducer'

import { appReducer } from 'app/app-reducer'
import { authReducer } from 'features/auth/auth-reducer'
import { usersApi } from 'features/users/users-API'

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  app: appReducer,
  packs: packsReducer,
  cards: cardsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

// @ts-ignore
window.store = store
