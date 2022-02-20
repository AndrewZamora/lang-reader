import React, { useState } from 'react';
import DOMPurify from 'dompurify'
import styles from '../styles/LangInput.module.css'
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
    <div className={styles.container}>
      <form onSubmit={event => handleSubmit(event)}>
        <textarea value={input} cols={50} rows={50} onChange={event => handleInput(event)}></textarea>
        <button type="submit">Submit</button>
      </form>
    </div >
  )
}

export default LangInput
