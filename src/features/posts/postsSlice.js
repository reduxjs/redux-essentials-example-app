import { createSlice, nanoid } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

const initialState = [
  { 
    id: '1', 
    title: 'First Post!', 
    content: 'Hello!', 
    date: sub(new Date(), { minutes: 10}).toISOString(),
    reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  },
  { id: '2', 
    title: 'Second Post', 
    content: 'More text', 
    date: sub(new Date(), { minutes: 5}).toISOString(),
    reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  },
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Когда мы пишем postAdded функцию редюсера, createSlice автоматически 
    // создает функцию создания действия с тем же именем что и у редюсера.
    postAdded: {
      reducer(state, { payload }) {
        state.push(payload) 
        // эти мутации преобразуются в безопасные неизменяемые обновления внутри с помощью библиотеки Immer
      },
      prepare(title, content, userId) { // это 'prepare callback', - он вызывается всякий
        // раз когда мы вызываем редьюсер выше. фун prepare как бы опережает reducer и выполняется раньше.
        // Результат выполнения функции prepare попадает во второй аргумент (action) функции reducer выше.
        return {
          payload: {
            id: nanoid(), // Уникальные идентификаторы и другие случайные значения должны быть введены в действие, а не вычисляться в редьюсере.
            date: new Date().toISOString(),
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
      console.log(postId, reaction)
      const existingPost = state.find(post => post.id === postId);
      if(existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload;
      const existingPost = state.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    }
  }
});


// createSlice будет генерировать (автоматически за кулисами) функции создания объекта действия для каждого редьюсера, который мы добавляем в слайс
// имя функции для создания действия совпадает с именем редюсера.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;



// Пользовательские селекторы
// stateпараметром для этих функций селектора является корневой объект состояния Redux, как и для встроенных анонимных селекторов, которые мы написали непосредственно внутри useSelector.
export const selectAllPosts = state => state.posts;

export const selectPostById = (state, postId) => state.posts.find(post => post.id === postId)