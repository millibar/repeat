import React from "react";

type Language = "japanese" | "english";

type CardProps = {
  sentence: string;
  language: Language;
};

export const Card: React.FC<CardProps> = ({ sentence, language }) => {
  return (
    <div className={`card ${language}`}>
      <label>
        <input type="checkbox" defaultChecked />
        <span>{sentence}</span>
      </label>
    </div>
  );
};
