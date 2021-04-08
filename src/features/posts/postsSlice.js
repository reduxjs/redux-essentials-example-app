import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { sub } from 'date-fns';

// const initialState = [
//   {
//     id: '1', 
//     title: 'First Post!', 
//     content: 'Hello!', 
//     user: '0',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       hooray: 0,
//       heart: 0,
//       rocket: 0,
//       eyes: 0
//     }
//   },
//   {
//     id: '2', 
//     title: 'Second Post', 
//     content: 'More text', 
//     user: '1',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       hooray: 0,
//       heart: 0,
//       rocket: 0,
//       eyes: 0
//     }
//   }
// ];

const initialState = {
  posts: [],
  status: 'idle',
  error: null
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts');
  return response.posts;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
  const response = await client.post('/fakeApi/posts', { post: initialPost });
  return response.post;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload);
    //   },
    //   prepare(title, content, userId, reactions) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title, 
    //         content,
    //         user: userId,
    //         reactions
    //       }
    //     }
    //   }
    // },
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    }
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.posts = state.posts.concat(action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addNewPost.fulfilled]: (state, action) => {
      state.posts.push(action.payload);
    }
  }
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts;

export const selectPostById = (state, postId) => 
  state.posts.posts.find(post => post.id === postId);