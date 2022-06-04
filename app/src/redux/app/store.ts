import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../features/user-slice'

export const store = configureStore ({
    reducer: {
        user : userSlice
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>