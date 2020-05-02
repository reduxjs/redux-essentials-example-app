import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    usersLoaded: usersAdapter.setAll,
  },
})

export const { usersLoaded } = usersSlice.actions

const usersSelectors = usersAdapter.getSelectors((state) => state.users)

export const {
  selectAll: selectAllUsers,
  selectEntities: selectUserEntities,
  selectById: selectUserById,
} = usersSelectors

export default usersSlice.reducer

export const fetchUsers = () => async (dispatch) => {
  const response = await client.get('/fakeApi/users')
  dispatch(usersLoaded(response.users))
}
