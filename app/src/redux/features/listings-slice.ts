import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DisplayType } from '../../interfaces/types'

const initialState: DisplayType[] = []

const listingsSlice = createSlice({
    name: 'listings',
    initialState,
    reducers : {
        update(state, action: PayloadAction<DisplayType[]>) {
            state = action.payload
        }
    }
})

export const { update } = listingsSlice.actions
export default listingsSlice.reducer