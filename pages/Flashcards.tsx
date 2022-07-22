import React, { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import WordTable from '../components/WordTable'
import type { NextPage } from 'next'

const Flashcards: NextPage = () => {
  const [cards, setCards] = useState([])

  const getAllFlashcards = (ids) => {
    let flashcards = []
    ids.forEach(id => {
      const storedReader = localStorage.getItem(`langReader-${id}`)
      flashcards = [...flashcards, ...JSON.parse(storedReader).deck]
    })
    setCards(flashcards)
  }

  useEffect(() => {
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      const ids = JSON.parse(storedReaders).map(reader => reader.id)
      getAllFlashcards(ids)
    }
  }, [])

  return (
    <Container maxWidth="lg">
      {cards.length ? <WordTable deck={cards} /> : <h2>No flashcards have been added.</h2>}
    </Container>
  )
}
export default Flashcards