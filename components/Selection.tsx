import React, { useEffect, useState } from 'react'
import { Button, IconButton, FormControl, TextField, } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

interface SelectionProps {
  word: {
    segment: string,
    hiragana: string,
    definition: string | any
  },
  deck: string[],
  onAdd(word: object): void,
  onRemove(word: object): void,
  onEdit(word: object): void,
}

const Selection = (props: SelectionProps) => {
  const { word, deck, onRemove, onAdd, onEdit } = props
  const [showEditInputs, setShowEditInputs] = useState(false)
  const [update, setUpdate] = useState({})

  useEffect(() => {
    if (showEditInputs) {
      setShowEditInputs(false)
    }
    setUpdate(word)
  }, [word])

  const useStyles = makeStyles({
    selectionContainer: {
      width: '100%',

    },
    settingsIconContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '10px 10px 0 0'
    },
    selectionContent: {
      margin: '0 10%'
    },
    segment: {
      textAlign: 'center'
    },
    button: {
      margin: "0 auto",
      display: "block"
    },
    inputs: {
      paddingBottom: "10px"
    },
    inputsContainer: {
      padding: "20px"
    },
    formBtn: {
      marginLeft: "auto"
    }
  })

  const classes = useStyles()

  const handleSubmit = (event) => {
    event.preventDefault()
    onEdit(word)
    setShowEditInputs(false)
  }
  return (
    <div className={classes.selectionContainer}>
      <div className={classes.settingsIconContainer}>
        <IconButton aria-label="settings" size="small" onClick={() => setShowEditInputs(!showEditInputs)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
      </div>
      {!showEditInputs && <div className={classes.selectionContent}>
        <h2 className={classes.segment}>{word.segment}</h2>
        <p><span>Reading: </span>{word.hiragana}</p>
        {word.definition && <p><span>Definition: </span>{word.definition}</p>}
        {deck.includes(word.segment) ? <Button variant="outlined" className={classes.button} onClick={() => onRemove(word)}>Remove from flashcards</Button> : <Button variant="outlined" className={classes.button} onClick={() => onAdd(word)}>Add to flashcards</Button>}
      </div>}
      {showEditInputs && <form onSubmit={event => handleSubmit(event)}>

        <FormControl fullWidth sx={{ m: 1 }} className={classes.inputsContainer}>
          <TextField
            label="Segment"
            variant="outlined"
            value={word.segment}
            className={classes.inputs}
            onChange={event => useState({...update, segment: event})}
          />
          <TextField
            label="Reading"
            variant="outlined"
            value={word.hiragana}
            className={classes.inputs}
            onChange={event => useState({...update, hiragana: event})}
          />
          <TextField
            label="Definition"
            variant="outlined"
            value={word.definition ? word.definition : ''}
            className={classes.inputs}
            onChange={event => useState({...update, definition: event})}
          />
          <Button className={classes.formBtn} variant="outlined" type="submit">Update</Button>
        </FormControl>
      </form>}
    </div>
  )
}

export default Selection
