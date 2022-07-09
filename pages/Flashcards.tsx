import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'

const Flashcards: NextPage = () => {
  const [cards, setCards] = useState([])

  useEffect(() => {
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      const ids = JSON.parse(storedReaders).map(reader => reader.id)
      ids.forEach(id => {
        const storedReader = localStorage.getItem(`langReader-${id}`)
        const flashcards = JSON.parse(storedReader).deck
        console.log(flashcards)
        setCards([...cards, flashcards])
      })
    }
  }, [])
  return (
    <div>
    </div>
  )
}
export default Flashcards