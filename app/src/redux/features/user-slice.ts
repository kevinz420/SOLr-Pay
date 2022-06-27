import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../../interfaces/types'

const initialState: UserType = {username: "", pfpURL: "", friends: []}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        update(state, action: PayloadAction<UserType>) {
            state.username = action.payload.username
            state.pfpURL = action.payload.pfpURL
            state.friends = action.payload.friends
        }
    }
})

export const { update } = userSlice.actions
export default userSlice.reducer