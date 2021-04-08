import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

// const initialState = [
//   { id: '0', name: 'Tiana Jenkins' },
//   { id: '1', name: 'Kevin Grant' },
//   { id: '2', name: 'Madison Price' }
// ];

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users');
  return response.users;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUsers.fulfilled]: (state, action) => {
      return action.payload;
    }
  }
});

export default usersSlice.reducer