import React, { useState } from 'react';
import styles from '../styles/langInput.module.css'

const LangInput = ({ handleOutput }) => {
  const [input, setInput] = useState('')

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input) {
      handleOutput(input)
      setInput('')
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={event => handleSubmit(event)}>
        <input type="text" value={input} onChange={event => handleInput(event)} />
        <button type="submit">click</button>
      </form>
    </div >
  )
}

export default LangInput
