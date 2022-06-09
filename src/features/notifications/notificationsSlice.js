import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client.js';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  
  // Мы можем передать аргумент создателю действия thunk, когда мы его отправляем, например dispatch(addPost(newPost)).
  async (_, { getState }) => { 
    
    // В createAsyncThunk, вы можете передать только один аргумент, и все, что мы передаем, 
    // становится первым аргументом обратного вызова создания полезной нагрузки.
    
    // Второй аргумент нашему создателю полезной нагрузки — это thunkAPI объект 
    // {
    //   dispatch/getState:  Фактические dispatchи getStat eметоды из нашего магазина Redux. 
    //                       Вы можете использовать их внутри thunk для отправки дополнительных действий 
    //                       или получения последнего состояния хранилища Redux 
    //                       (например, чтение обновленного значения после отправки другого действия).
                      
    //   extra:              «Дополнительный аргумент», который можно передать в thunk middleware при создании хранилища. 
    //                       Обычно это какая-то оболочка API, такая как набор функций, которые знают, как выполнять вызовы API на сервер 
    //                       вашего приложения и возвращать данные, поэтому вашим thunk'aм не нужно иметь все URL-адреса и логику запросов непосредственно внутри
    
    //   requestId:          Уникальное случайное значение идентификатора для этого вызова thunk'a. Полезно для отслеживания статуса отдельного запроса.

    //   signal:             AbortController.signal функция, которую можно использовать для отмены выполняемого запроса.
                      
    //   rejectWithValue:    Утилита, которая помогает настроить содержимое rejected действия, если thunk получает ошибку.
    // }

    // Если вы пишете преобразователь вручную вместо использования createAsyncThunk, функция преобразователя 
    // будет получать (dispatch, getState)отдельные аргументы, а не объединять их в один объект.
    // INFO: https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments
    //       https://redux-toolkit.js.org/api/createAsyncThunk

    const allNotifications = selectAllNotifications(getState());
    const [latestNotification] = allNotifications; // Получаем самый первый объект уведомления в массиве (свежее уведомление находится в начале массива)
    const latestTimestamp = latestNotification ? latestNotification.date : '';
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.data;
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach(notification => {
        notification.read = true;
      })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.push(...action.payload);
        state.forEach(notification => {
          notification.isNew = !notification.read;
        })
        // Сортируем массив объектов так, чтобы объект уведомления с самой свежей датой оказался первым.
        state.sort((a,b) => b.date.localeCompare(a.date));
      })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectAllNotifications = (state) => state.notifications;