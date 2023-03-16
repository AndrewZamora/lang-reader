import React from 'react'
import { Container, Button } from '@mui/material'
import WordTable from '../components/WordTable'
import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { saveAs } from 'file-saver'
import { jsonToCsv } from '../utilities/createFile'
import { Download } from '@mui/icons-material'
import styles from './Flashcards.module.css'

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
const handleDownload = async (flashcards: Deck[]) => {
  if (!flashcards) return
  const json = flashcards.map((card: Deck) => {
    const {
      segment,
      hiragana,
      definition
    } = card
    return { segment, reading: hiragana, definition }
  })
  const csv = jsonToCsv(json)
  const blob = new Blob([csv], { type: 'text/csv' })
  const date = new Date()
  saveAs(blob, `allFlashcards-${date.getTime()}.csv`)
}

const Flashcards: NextPage = () => {
  const createTable = () => {
    const deck = createCards()
    return (deck?.length ? <div>
      <div className={styles.flashcardButtons}  >
        <Button onClick={() => handleDownload(deck)} variant="contained" endIcon={<Download />}>
          Export to CSV
        </Button>
      </div>
      <WordTable deck={deck} /></div>
      : <h2>No flashcards have been added.</h2>)
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