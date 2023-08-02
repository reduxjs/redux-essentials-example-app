import { client } from "../../api/client";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { nanoid } = require("nanoid");

const initialState = {
  posts: [],
  status: "idle",
  error: null
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(posts, action) {
        posts.posts.push(action.payload);
      },
      prepare({ title, content }) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        };
      }
    },
    editPost: {
      reducer(state, action) {
        const { postId, title, content } = action.payload;
        const existingPost = state.posts.find((post) => post.id === postId);

        if (existingPost) {
          existingPost.title = title;
          existingPost.content = content;
        }
      },
      prepare(action) {
        return {
          payload: {
            ...action
          }
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "success";
        state.posts = [...state.posts, ...action.payload];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = "failed";
        state.error = action.error.message;
      })
      .addCase("posts/hello", (state, action) => {
        console.log("HEELOO", action);
      });
  }
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client("/fakeApi/posts");
  return response.data;
});

export const { addPost, editPost } = postSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) => {
  return state.posts.posts.find((item) => item.id === postId);
};

export default postSlice.reducer;
