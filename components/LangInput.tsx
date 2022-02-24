import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import styles from '../styles/LangInput.module.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import { Grid } from '@mui/material'
interface LangInputProps {
  handleOutput(output: string): void,
}

const LangInput = (props: LangInputProps) => {
  const { handleOutput } = props
  const [input, setInput] = useState('')

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input) {
      handleOutput(DOMPurify.sanitize(input))
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
        <TextField
          id="filled-multiline-static"
          label="Reader Text"
          multiline
          rows={50}
          variant="outlined"
          onChange={event => handleInput(event)}
          value={input}
          fullWidth
        />
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Button  variant="outlined" className={classes.btn} type="submit">Submit</Button>
        </Grid>
      </form>
    </div>
  )
}

export default LangInput
