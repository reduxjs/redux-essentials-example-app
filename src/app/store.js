import { configureStore } from "@reduxjs/toolkit";

import postsReducer from "../features/posts/postsSlice";
import avaliationsReducer from "../features/avaliations/avaliationSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    avaliations: avaliationsReducer
  }
});
