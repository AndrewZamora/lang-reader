import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'

const Flashcards: NextPage = () => {
  const [cards, setCards] = useState([])
  
  useEffect(() => {
    console.log("useEffect 1 ")
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      const ids = JSON.parse(storedReaders).map(reader => reader.id)
      console.log(ids)
    }
  }, [])
  return (
    <div>
    </div>
  )
}
export default Flashcards