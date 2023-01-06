import React, { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import WordTable from '../components/WordTable'
import type { NextPage } from 'next'
import Layout from '../components/Layout'

const Flashcards: NextPage = () => {
  const [cards, setCards] = useState([])

  const getAllFlashcards = (ids: [string]) => {
    let flashcards = []
    ids.forEach((id: string) => {
      const storedReader = localStorage.getItem(`langReader-${id}`)
      const parsedReader = storedReader ? JSON.parse(storedReader) : null
      if (parsedReader.deck && parsedReader.deck.length) {
        flashcards = [...flashcards, ...parsedReader.deck]
      }
    })
    if (flashcards.length) {
      setCards(flashcards)
    }
  }

  useEffect(() => {
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      const ids = JSON.parse(storedReaders).map((reader: object) => reader.id)
      getAllFlashcards(ids)
    }
  }, [])

  return (
    <Layout>
      <Container maxWidth="lg">
        {cards.length ? <WordTable deck={cards} /> : <h2>No flashcards have been added.</h2>}
      </Container>
    </Layout>
  )
}
export default Flashcards