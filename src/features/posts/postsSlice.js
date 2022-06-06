import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
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
  status: 'pending',
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
    // колбек фун. ( или "payloadCreator"): возвращает (промис из-за наличия async | значение синхронно без async)
    // Перед началом выполнения эта функция всегда вызывает создатель действия fetchPosts.pending() (чтобы указать о состоянии выполнения thunk'a), 
    // который сразу будет прослушан в extraReducer
    // Результат выполнения: (Promise c данными && вызов fetchPosts.fulfilled() | отклоненный Promiseс ошибкой && вызов fetchPosts.rejected()]
    const response = await client.get('/fakeApi/posts');
    return response.data;
  },
  // Третий аргумент options объект (необязательно).
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Когда мы пишем postAdded функцию редюсера, createSlice автоматически создает функцию создания действия с тем-же именем, что и у редюсера.
    postAdded: {
      reducer(state, { payload }) {
        state.posts.push(payload) // это мутация. Она преобразуются в безопасные неизменяемые обновления за счет Immer'a
      },
      prepare(title, content, userId) { // или 'prepare callback', вызывается перед вызовом  reducer, чтобы подготовить данные экшена. 
        return { // Результат выполнения функции prepare объект action, который прокидывается во второй аргумент функции reducer выше. 
          payload: {
            id: nanoid(), // Уникальные идентификаторы и другие случайные значения положено вычислять до попадания в редьюсер. Редюсер должен содержать основную логику.
            date: new Date().toISOString(), // Создание даты и её трансформация в формат ISO. (гг.мм.дд)
            title,
            content,
            user: userId,
            reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0},
          }
        }
      },
    },
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
  }
});


// createSlice будет генерировать (автоматически за кулисами) функции создания объекта действия для каждого редьюсера, который мы добавляем в слайс
// имя функции для создания действия совпадает с именем редюсера.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;



// Пользовательские селекторы
// stateпараметром для этих функций селектора является корневой объект состояния Redux, как и для встроенных анонимных селекторов, которые мы написали непосредственно внутри useSelector.
export const selectAllPosts = state => state.posts.posts;

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)