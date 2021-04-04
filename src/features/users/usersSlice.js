import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: '0', name: 'Tiana Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' }
];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer