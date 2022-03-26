import React from 'react'
import { Button } from '@mui/material'

interface SelectionProps {
  word: {
    segment: string,
    hiragana: string,
  },
  deck: string[],
  onAdd(word: object): void,
  onRemove(word: object): void,
}

const Selection = (props: SelectionProps) => {
  const { word, deck, onRemove, onAdd } = props
  return (
    <div>
      <h2>{word.segment}</h2>
      <p><span>Reading: </span>{word.hiragana}</p>
      {deck.includes(word.segment) ? <Button variant="outlined" onClick={() => onRemove(word)}>Remove from Anki Deck</Button> : <Button variant="outlined" onClick={() => onAdd(word)}>Add to Anki Deck</Button>}
    </div>
  )
}

export default Selection
