import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { client } from '../../api/client';
// import { sub } from 'date-fns';

// const initialState = [
  // { 
    // id: '1', 
    // title: 'First Post!', 
    // content: 'Hello!', 
    // date: sub(new Date(), { minutes: 10}).toISOString(),
    // reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  // },
  // { id: '2', 
    // title: 'Second Post', 
    // content: 'More text', 
    // date: sub(new Date(), { minutes: 5}).toISOString(),
    // reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  // },
// ];

const initialState = {
  posts: [],
  status: 'idle', // Состояние загрузки обычно должно храниться как перечисление, например 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};


 
// Результат вызова createAsyncThunk одна функция fetchPosts, имеющая три свойства fetchPosts.(pending|fulfilled|rejected)
// 1)fetchPosts - выполняет колбек функцию (из второго аргумента), но перед выполнением она вызовет внутр. свойство(функция) fetchPosts.pending() для отправки типа действия 'posts/fetchPosts/pending'
// 2)fetchPosts.pending() 3)fetchPosts.fulfilled()  4)fetchPosts.rejected() - три функции создателя действия, используются для определения статуса выполнения thunk'a
// и его обработки в createSlice({ extraReducers(builder): { ТУТ-> builder.addCase() } })

// API: https://redux-toolkit.js.org/api/createAsyncThunk#overview
// Гайд: https://redux.js.org/tutorials/essentials/part-5-async-logic#fetching-data-with-createasyncthunk
// Возвращаемое значение фун. createAsyncThunk: https://redux-toolkit.js.org/api/createAsyncThunk#return-value

export const fetchPosts = createAsyncThunk( // // fetchPosts- выполняет ajax запрос на сервер(имитация) для получения списка сообщений.
  'posts/fetchPosts',
  // 'posts/fetchPosts' - использоваться в качестве префикса для генерации трех типов действий 'posts/fetchPosts/(pending|fulfilled|rejected)'.
  
  async () => {
    // колбек «создатель полезной нагрузки», который должен возвращать Promise.
    // Перед началом выполнения эта функция всегда вызывает создатель действия fetchPosts.pending(), 
    // чтобы указать хранилищу о начале выполнения thunk'a, который сразу будет прослушан в extraReducer
    // Результат выполнения: Promise c данными и вызов fetchPosts.fulfilled() ИЛИ отклоненный Promise с ошибкой и вызов fetchPosts.rejected() 
    // не забудь про всплытие ошибки из rejected, для этого нужно юзать  .unwrap() https://redux-toolkit.js.org/api/createAsyncThunk#unwrapping-result-actions
    const response = await client.get('/fakeApi/posts');
    return response.data;
  },
  // Третий аргумент options объект (необязательно).
) // Всё удобство createAsyncThunk API в том, что отправкой действий он занимается самостоятельно.

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => { // параметр - объект. Он содержащий данные из формы наход. в компоненте AddPostForm.js
    const response = await client.post('/fakeApi/posts', initialPost);
    return response.data;
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // // Когда мы пишем postAdded функцию редюсера, createSlice автоматически создает функцию создания действия с тем-же именем, что и у редюсера.
    // postAdded: {
    //   reducer(state, { payload }) {
    //     state.posts.push(payload) // это мутация. Она преобразуются в безопасные неизменяемые обновления за счет Immer'a
    //   },
    //   prepare(title, content, userId) { // или 'prepare callback', вызывается перед вызовом  reducer, чтобы подготовить данные экшена. 
    //     return { // Результат выполнения функции prepare объект action, который прокидывается во второй аргумент функции reducer выше. 
    //       payload: {
    //         id: nanoid(), // Уникальные идентификаторы и другие случайные значения положено вычислять до попадания в редьюсер. Редюсер должен содержать основную логику.
    //         date: new Date().toISOString(), // Создание даты и её трансформация в формат ISO. (гг.мм.дд)
    //         title,
    //         content,
    //         user: userId,
    //         reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0},
    //       }
    //     }
    //   },
    // },
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if(existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    }
  },
  // Обрабатывает/прослушивает три фун. (создатели действия), которые порождает функция "createAsyncThunk"
  extraReducers(builder) { 
    // Гайд: https://redux.js.org/tutorials/essentials/part-5-async-logic#reducers-and-loading-actions
    builder
    // Перед выполнением фун. fetchPosts вызывает функцию fetchPosts.pending (создатель действия), которая посылает тип действия 'posts/fetchPosts/pending'
    // этот тип действия отлавливатся и обрабатыватся в соответ. обработчике, в нашем случе в .addCase(fetchPosts.pending, ... )
    .addCase(fetchPosts.pending, (state, action) => { // т.е. ТУТ
        state.status = 'loading'; 
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
  }
});


// createSlice будет генерировать (автоматически за кулисами) функции создания объекта действия для каждого редьюсера, который мы добавляем в слайс
// имя функции для создания действия совпадает с именем редюсера.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;



// Пользовательские селекторы
// useDispatch посылает результат store.getState в первый аргумент пользовательского селектора т.е. в state 
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)


// Генерирует запоминаемые селекторы, которые будут пересчитывать результаты только при изменении входных данных.
// Если мы попытаемся вызвать selectPostsByUser несколько раз, он будет повторно запускать селектор вывода только в том случае, если что-либо postsили userId изменилось
export const selectPostByUser = createSelector(
  // Когда мы вызываем selectPostsByUser(state, userId), createSelector передаем все аргументы в каждый из наших селекторов ввода. 
  [
    selectAllPosts, // Первый входной селектор будет иметь параметры (state и userId)
    (state, userId) => userId // Второй входной селектор получит такие же параметры при вызове (state, userId)
  ], 
  
  // Результат первого входного селектора будет posts, результат второго селектора будет userId
  (posts, userId) => posts.filter(post => post.user === userId)  
)