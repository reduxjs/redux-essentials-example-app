import { Action, ThunkAction } from '@reduxjs/toolkit'
import { store } from './store'

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action>
