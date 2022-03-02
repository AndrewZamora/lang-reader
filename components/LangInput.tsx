import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import styles from '../styles/LangInput.module.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import { Grid } from '@mui/material'
import FormControl from '@mui/material/FormControl'

interface LangInputProps {
  handleOutput(output: string): void,
}

const LangInput = (props: LangInputProps) => {
  const { handleOutput } = props
  const [input, setInput] = useState('')
  const [name, setName] = useState('')

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input && name) {
      const output = {
        text: DOMPurify.sanitize(input),
        name
      }
      handleOutput(output)
      setInput('')
    }
  }

  const useStyles = makeStyles({
    btn: {
      marginTop: '20px'
    }
  })

  const classes = useStyles()

  return (
    <div>
      <form noValidate autoComplete='off' onSubmit={event => handleSubmit(event)}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <TextField
          id="reader-name-input"
          label="Reader Name"
          variant="outlined"
          onChange={event => handleName(event)}
          />
          <TextField
            id="filled-multiline-static"
            label="Reader Text"
            multiline
            variant="outlined"
            minRows={20}
            onChange={event => handleInput(event)}
            value={input}
            fullWidth
          />
        </FormControl>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Button variant="outlined" className={classes.btn}>Cancel</Button>
          <Button variant="outlined" className={classes.btn} type="submit">Create</Button>
        </Grid>
      </form>
    </div>
  )
}

export default LangInput
