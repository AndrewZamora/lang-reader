import React from 'react'

interface SelectionProps {
  word: {
    segment: string,
    hiragana: string,
  },
  whitelist:string[],
  onAddToDeck(word: object): void,
}

const Selection = (props: SelectionProps) => {
  const { word, whitelist, onAddToDeck } = props
  return <div>
    <h2>{word.segment}</h2>
    <p><span>Reading: </span>{word.hiragana}</p>
    {!whitelist.includes(word.segment) && <button onClick={() => onAddToDeck(word)}>Add to Anki Deck</button>}
  </div>
}

export default Selection
