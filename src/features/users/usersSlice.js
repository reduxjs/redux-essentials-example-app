import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const usersAdapter = createEntityAdapter(); // объект с настройками не нужен, по этому ничего не передаем.

// const initialState = [
//   { id: '0', name: 'Tianna Jenkins' },
//   { id: '1', name: 'Kevin Grant' },
//   { id: '2', name: 'Madison Price' }
// ]
// const initialState = [];
const initialState = usersAdapter.getInitialState(); // {entities: {}, ids:[]}


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
      // .addCase(fetchUsers.fulfilled, (state, action) => {
        // state.push(...action.payload) может привести к дублированию списка пользователей
        // return action.payload; // Immer полностью заменяет initialState новым объектом
      // })
      .addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  }
});

export default usersSlice.reducer;

// export const selectAllUsers = (state) => state.users;
// export const selectUserById = (state, userId) => state.users.find((user) => user.id === userId);
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => state.users);