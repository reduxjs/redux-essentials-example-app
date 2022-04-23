import { sub } from "date-fns";
const { createSlice, nanoid } = require("@reduxjs/toolkit");

const initialState = [
  {
    id: "1",
    title: "First Post!",
    content: "Hello!",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: { thumbsUp: 0, hooray: 0 }
  },
  {
    id: "2",
    title: "Second Post",
    content: "More text",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: { thumbsUp: 0, hooray: 0 }
  }
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: { thumbsUp: 0, hooray: 0 }
          }
        };
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.find((item) => item.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    }
  }
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
