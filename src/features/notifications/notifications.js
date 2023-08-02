import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState());

    const [latestNotification] = allNotifications;
    const latestTimeStamp = latestNotification
      ? latestNotification.timeStamp
      : "";

    const response = await client(
      `/fakeApi/notifications?since=${latestTimeStamp}`
    );

    return response.data;
  }
);

const notificationsSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {
    allNotifications(state, action) {
      state.forEach((item) => {
        item.read = true;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, () => {})
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const payload = action.payload;
        const arr = payload.map((item) => {
          item.isNew = true;
          return item;
        });
        state.push(...arr);

        state.sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(fetchNotifications.rejected, () => {});
  }
});

export const { allNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;

export const selectAllNotifications = (state) => state.notifications;
