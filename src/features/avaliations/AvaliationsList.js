import React from "react";
import { useSelector } from "react-redux";

export const AvaliationsList = () => {
  const avaliations = useSelector((state) => state.avaliations);

  const renderedAvaliations = avaliations.map((avaliation) => (
    <article className="avaliation-excerpt" key={avaliation.id}>
      <h3>
        {avaliation.title} -- {avaliation.content}
      </h3>
    </article>
  ));

  return (
    <section className="avaliation-list">
      <h2>Avaliations</h2>
      {renderedAvaliations}
    </section>
  );
};
