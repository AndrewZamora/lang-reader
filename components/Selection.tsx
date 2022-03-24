import React from 'react'

interface SelectionProps {
  word: {
    segment: string,
    hiragana: string,
  },
  whitelist:string[],
  onClick(word: object): void,
}

const Selection = (props: SelectionProps) => {
  const { word, onClick } = props
  return <div>
    <h2>{word.segment}</h2>
    <p><span>Reading: </span>{word.hiragana}</p>
    <button onClick={() => onClick(word)}>Add to Anki Deck</button>
  </div>
}

export default Selection
