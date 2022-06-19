import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
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

const notificationAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date) // Сортируем массив объектов так, чтобы объект уведомления с самой свежей датой оказался первым.
});

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true;
      })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        notificationAdapter.upsertMany(state, action.payload); // принимает массив сущностей или объект, выполнит поверхностную копию, 
        // чтобы объединить старые и новые объекты, перезаписав существующие значения, добавив все, чего не было, и не касаясь свойств, не представленных в новом объекте.
        // state.push(...action.payload); Аналог
        
        Object.values(state.entities).forEach(notification => {
          notification.isNew = !notification.read; // Любые уведомления, которые мы прочитали, больше не являются новыми
        })
      })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const { selectAll: selectAllNotifications } = 
  notificationAdapter.getSelectors((state) => state.notifications)
// export const selectAllNotifications = (state) => state.notifications;