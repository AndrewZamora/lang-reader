import React from 'react';

const Selection = ({word, onAddToDeck}) => {
  return <div>
    <h2>{word.segment}</h2>
    <p><span>Reading: </span>{word.hiragana}</p>
  </div>
}

export default Selection
