import React, { useState } from 'react'
import { Button, IconButton, FormControl, TextField, } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import styles from './Selection.module.css'
import Deck from '../types/Deck'
import Word from '../types/Word'

interface SelectionProps {
  word: Deck,
  deck: string[],
  onAdd(word: object): void,
  onRemove(word: object): void,
  onEdit(word: object): void,
  onDelete(word: object): void,
  onDefine(word: object): Promise<string>,
  onMerge(word: object, direction: string): void,
}

const Selection = (props: SelectionProps) => {
  const { word, deck, onRemove, onAdd, onEdit, onDelete, onMerge, onDefine } = props
  const [showEditInputs, setShowEditInputs] = useState(false)
  const [update, setUpdate] = useState<Word | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (update) {
      onEdit(update)
      setShowEditInputs(false)
    }
  }

  const handleDelete = () => {
    if (update) {
      onDelete(update)
      setShowEditInputs(false)
    }
  }

  const getDefinition = async () => {
    if (update) {
      // TODO: Need to look into a better way of handling await here
      const definition = await onDefine(update)
      if (definition) {
        setUpdate({ ...update, definition })
      } else {
        return ''
      }
    }
  }

  const handleEdit = () => {
    setShowEditInputs(!showEditInputs)
    setUpdate(word)
  }

  const handleMerge = (update: object, direction: string) => {
    onMerge(update, direction)
    setShowEditInputs(false)
  }

  return (
    <div className={styles.selectionContainer}>
      <div className={styles.settingsIconContainer}>
        <IconButton aria-label="settings" size="small" onClick={() => handleEdit()}>
          <EditIcon fontSize="inherit" />
        </IconButton>
      </div>
      {!showEditInputs && <div className={styles.selectionContent}>
        <h2 className={styles.segment}>{word.segment}</h2>
        <p><span>Reading: </span>{word.hiragana}</p>
        {word.definition && <p><span>Definition: </span>{word.definition}</p>}
        {deck.includes(word.segment) ? <Button variant="outlined" className={styles.button} onClick={() => onRemove(word)}>Remove from flashcards</Button> : <Button variant="outlined" className={styles.button} onClick={() => onAdd(word)}>Add to flashcards</Button>}
      </div>}
      {(update && showEditInputs) && <form onSubmit={event => handleSubmit(event)}>

        <FormControl fullWidth sx={{ m: 1 }} className={styles.inputsContainer}>
          <TextField
            label="Segment"
            variant="outlined"
            value={update.segment}
            className={styles.inputs}
            onChange={event => setUpdate({ ...update, segment: event.target.value })}
          />
          <TextField
            label="Reading"
            variant="outlined"
            value={update.hiragana}
            className={styles.inputs}
            onChange={event => setUpdate({ ...update, hiragana: event.target.value })}
          />
          <TextField
            label="Definition"
            variant="outlined"
            value={update.definition ? update.definition : ''}
            className={styles.inputs}
            onChange={event => setUpdate({ ...update, definition: event.target.value })}
          />
          <Button className={styles.formBtn} variant="outlined" type="submit">Update</Button>
          <Button className={styles.formBtn} onClick={() => handleDelete()} variant="outlined">Delete</Button>
          <Button className={styles.formBtn} onClick={() => handleMerge(update, 'right')} variant="outlined">Merge Right</Button>
          <Button className={styles.formBtn} onClick={() => handleMerge(update, 'left')} variant="outlined">Merge left</Button>
          <Button className={styles.formBtn} onClick={() => getDefinition()} variant="outlined">Define</Button>
        </FormControl>
      </form>}
    </div>
  )
}

export default Selection
