import React from 'react'
import { Container } from '@mui/material'
import WordTable from '../components/WordTable'
import type { NextPage } from 'next'
import Layout from '../components/Layout'

interface Deck {
  segment: string,
  hiragana: string,
  definition?: string,
  isWordLike: boolean,
  id: string,
}
const getAllFlashcards = (ids: [string]) => {
  let flashcards: Array<Deck> = []
  ids.forEach((id: string) => {
    const storedReader = localStorage.getItem(`langReader-${id}`)
    const parsedReader = storedReader ? JSON.parse(storedReader) : null
    if (parsedReader.deck && parsedReader.deck.length) {
      flashcards = [...flashcards, ...parsedReader.deck]
    }
  })
  return flashcards.length ? flashcards : []
}
const createCards = () => {
  if (typeof window !== 'undefined') {
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      const ids = JSON.parse(storedReaders).map((reader: { id: string }) => reader.id)
      const allCards = getAllFlashcards(ids)
      return allCards
    }
  }
  return []
}
const Flashcards: NextPage = () => {
  const createTable = () => {
    const deck = createCards()
    return (deck?.length ? <WordTable deck={deck} /> : <h2>No flashcards have been added.</h2>)
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        {createTable()}
      </Container>
    </Layout>
  )
}
export default Flashcards