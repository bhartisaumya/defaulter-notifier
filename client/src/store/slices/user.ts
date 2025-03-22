import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../interface'

// Ensure initialState is explicitly typed as IUser | null
const initialState: IUser | null = null

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: IUser, action: PayloadAction<IUser>) => {
            if(!state)
                return action.payload

            // Replace null state with the payload or update existing state
            // state.name = action.payload.name
            // state.email = action.payload.email
            // state.role = action.payload.role
            // state.token = action.payload.token
            return action.payload
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
