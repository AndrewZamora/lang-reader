
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'

const CreateReader: NextPage = () => {
  const [deckName, setDeckName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleOutput = (output: string) => {
    console.log(output)
  }

  const handleOnClick = () => {
    setShowForm(true)
  }

  const getDeckName = () => {
    if (showForm) return
    return (
      <div>
        Deck Name
        <input type="text" value={deckName} onChange={event => setDeckName(event.target.value)} />
        <button onClick={() => handleOnClick() }>next</button>
      </div>
    )
  }

  return (
    <div>
      {getDeckName()}
      {showForm && <LangInput handleOutput={output => handleOutput(output)}></LangInput>}
    </div>
  )
}

export default CreateReader
