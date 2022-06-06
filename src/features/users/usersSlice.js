import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
// const initialState = [
//   { id: '0', name: 'Tianna Jenkins' },
//   { id: '1', name: 'Kevin Grant' },
//   { id: '2', name: 'Madison Price' }
// ]

const initialState = [];

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await client.get('/fakeApi/users');
    return response.data
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload; // Immer полностью заменяет initialState новым объектом
        // state.push(...action.payload) может привести к дублированию списка пользователей
      })
  }
});

export default usersSlice.reducer;
