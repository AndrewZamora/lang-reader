import React from 'react'
import { Button } from '@mui/material'

interface SelectionProps {
  word: {
    segment: string,
    hiragana: string,
    definition: string | any
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
      {word.definition && <p>{word.definition}</p>}
      {deck.includes(word.segment) ? <Button variant="outlined" onClick={() => onRemove(word)}>Remove from flashcards</Button> : <Button variant="outlined" onClick={() => onAdd(word)}>Add to flashcards</Button>}
    </div>
  )
}

export default Selection
