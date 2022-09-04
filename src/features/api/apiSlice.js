import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  // Если вы не укажете reducerPath параметр, по умолчанию он будет 'api' 
  reducerPath: 'api', // store: state.api

  // Все наши запросы будут иметь URL-адреса, начинающиеся с «/fakeApi».
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi'}), 
  
  // «Конечные точки» представляют собой операции и запросы для этого сервера.
  // По умолчанию конечные точки запроса будут использовать GET HTTP-запрос
  // Для переопределения, вернуть объект, типа: {url: '/posts', method: 'POST', body: newPost} вместо самой строки URL
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',  // URL для запроса: '/fakeApi/posts'
    }),
  }),
});

// Экспортируем автоматически сгенерированный хук для конечной точки запроса `getPosts`
// Ведь RTKQ-react автоматически генерирует хуки для каждой созданной нами конечной точки!
export const { useGetPostsQuery } = apiSlice;


// Почему именно useGetPostsQuery ?
// Хуки автоматически именуются на основе стандартного соглашения:
// use - префикс, говорящий что это хук React'а
// Имя конечной точки, с заглавной буквы
// Тип конечной точки Query или Mutation