import {configureStore} from '@reduxjs/toolkit'
import listingSlice from '../features/listings-slice'

export const store = configureStore ({
    reducer: {
        listings : listingSlice
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>