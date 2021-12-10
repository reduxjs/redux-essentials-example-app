import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import { avaliationAdded } from "./avaliationSlice";
export const AddAvaliation = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const onTitleChanged = (e) => setTitle(e.target.value);

  const onSaveAvaliationClicked = () => {
    if (title) {
      dispatch(
        avaliationAdded({
          id: nanoid(),
          title,
          content
        })
      );

      setTitle("");
      setContent("");
    }
  };

  return (
    <section>
      <h2>Add a New Avaliation</h2>
      <form>
        <label htmlFor="avaliationNote">Avaliation Note</label>
        <input
          type="text"
          id="avaliationNote"
          name="avaliationNote"
          value={title}
          onChange={onTitleChanged}
        />
        <button type="button" onClick={onSaveAvaliationClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};
