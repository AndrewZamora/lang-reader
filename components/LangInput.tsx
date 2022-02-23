import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import styles from '../styles/LangInput.module.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <TextField
        id="filled-multiline-static"
        label="Reader Text"
        multiline
        rows={50}
        variant="filled"
        onChange={event => handleInput(event)}
        value={input}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default LangInput
