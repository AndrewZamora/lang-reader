
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'

const CreateReader: NextPage = () => {
  const [readerName, setReaderName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleOutput = (output: string) => {
    console.log(output)
  }

  const handleOnClick = () => {
    setShowForm(true)
  }

  const getReaderName = () => {
    if (showForm) return
    return (
      <div>
        Deck Name
        <input type="text" value={readerName} onChange={event => setReaderName(event.target.value)} />
        <button onClick={() => handleOnClick() }>next</button>
      </div>
    )
  }

  return (
    <div>
      {getReaderName()}
      {showForm && <LangInput handleOutput={output => handleOutput(output)}></LangInput>}
    </div>
  )
}

export default CreateReader
