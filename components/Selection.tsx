import React from 'react'
import { Button, IconButton } from '@mui/material'
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
}

const Selection = (props: SelectionProps) => {
  const { word, deck, onRemove, onAdd } = props
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
    }
  })

  const classes = useStyles()
  return (
    <div className={classes.selectionContainer}>
      <div className={classes.settingsIconContainer}>
        <IconButton aria-label="settings" size="small">
          <EditIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div className={classes.selectionContent}>
        <h2 className={classes.segment}>{word.segment}</h2>
        <p><span>Reading: </span>{word.hiragana}</p>
        {word.definition && <p><span>Definition: </span>{word.definition}</p>}
      </div>
      {deck.includes(word.segment) ? <Button variant="outlined" className={classes.button} onClick={() => onRemove(word)}>Remove from flashcards</Button> : <Button variant="outlined" className={classes.button} onClick={() => onAdd(word)}>Add to flashcards</Button>}
    </div>
  )
}

export default Selection
