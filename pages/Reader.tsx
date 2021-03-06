
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Quiz, Download, Edit as EditIcon } from '@mui/icons-material'
import { Paper, Container, Grid, Tabs, Tab, Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import Selection from '../components/Selection'
import WordTable from '../components/WordTable'
import { saveAs } from 'file-saver'
import styles from './Reader.module.css'

const DICT_PATH = '/static/dict/'

const Reader: NextPage = () => {
  const router = useRouter()
  const [reader, setReader] = useState<object | null>(null)
  const [selection, setSelection] = useState<object | null>(null)
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [deck, setDeck] = useState([])
  const [tab, setTab] = useState(0)

  const setUp = useCallback(async () => {
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    setKuroshiro(newKuroshiro)
  }, [])

  useEffect(() => {
    console.log("useEffect reader")
    if (kuroshiro) return
    setUp()
  }, [kuroshiro])

  useEffect(() => {
    const { id } = router.query
    console.log("useEffect reader page")
    if (id) {
      const localData = localStorage.getItem(`langReader-${id}`)
      if (localData) {
        const localReader = JSON.parse(localData)
        console.log(localReader, id)
        setReader(localReader)
        if (localReader.deck) {
          setDeck(localReader.deck)
        }
      }
    }
  }, [router])


  const getHiragana = async (segment) => {
    if (kuroshiro) {
      const hiragana = await kuroshiro.convert(segment, { to: 'hiragana' })
      return hiragana
    } else {
      return segment
    }
  }

  const getDefinition = async (search: string) => {
    const word = encodeURIComponent(search)
    const response = fetch(`api/definition?word=${word}`).catch(error => console.log(error))
    const json = await (await response).json()
    return json.data
  }

  const handleDefine = async (segment) => {
    const definition = await getDefinition(segment.segment)
    if (definition.length && definition[0] && definition[0].senses.length && definition[0].senses[0].english_definitions.length) {
      let newSelection = { ...segment }
      newSelection.definition = definition[0].senses[0].english_definitions[0]
      setSelection(newSelection)
    }
  }

  const handleClick = async (segment) => {
    const hiragana = await getHiragana(segment.segment)
    let newSelection = { ...segment, hiragana }
    if (segment.definition) {
      newSelection.definition = segment.definition
    }
    setSelection(newSelection)
  }

  const addToDeck = (word) => {
    const deckUpdate = [...deck, word]
    setDeck(deckUpdate)
    const readerUpdate = { ...reader, deck: deckUpdate }
    localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(readerUpdate))
    const localData = localStorage.getItem(`langReader-${reader.id}`)
    const localReader = JSON.parse(localData)
    setReader(localReader)
  }

  const removeFromDeck = (word) => {
    if (deck.length) {
      const deckUpdate = deck.filter(card => card.segment !== word.segment)
      setDeck(deckUpdate)
      const readerUpdate = { ...reader, deck: deckUpdate }
      localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(readerUpdate))
      const localData = localStorage.getItem(`langReader-${reader.id}`)
      const localReader = JSON.parse(localData)
      setReader(localReader)
    }
  }

  const mergeSegment = async (word: object, direction: string) => {
    console.log({ word })
    const wordIndex = reader.segments.findIndex(segment => segment.id === word.id)
    const directions = { right: 1, left: -1 }
    const selectionIndex = `${wordIndex + directions[direction]}`
    const mergeSelection = reader.segments[selectionIndex]
    if (mergeSelection.isWordLike) {
      let mergedWord = { ...word }
      mergedWord.segment = direction === 'right' ? `${mergedWord.segment}${mergeSelection.segment}` : `${mergeSelection.segment}${mergedWord.segment}`
      const hiragana = await getHiragana(mergedWord.segment)
      mergedWord.hiragana = hiragana
      let readerUpdate = { ...reader }
      readerUpdate.segments[wordIndex] = mergedWord
      readerUpdate.segments = readerUpdate.segments.filter(segment => segment.id !== mergeSelection.id)
      localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(readerUpdate))
      const localData = localStorage.getItem(`langReader-${reader.id}`)
      const localReader = JSON.parse(localData)
      setReader(localReader)
      setSelection(mergedWord)
    }
  }

  const editSegment = (word) => {
    console.log(word, "word")
    const updatedSegments = reader.segments.map(segment => {
      if (segment.id === word.id) {
        console.log(segment, word)
        return word
      }
      return segment
    })
    const readerUpdate = { ...reader }
    readerUpdate.segments = updatedSegments
    localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(readerUpdate))
    const localData = localStorage.getItem(`langReader-${reader.id}`)
    const localReader = JSON.parse(localData)
    setReader(localReader)
    setSelection(word)
  }

  const deleteSegment = (word) => {
    console.log(word, "word")
    const updatedSegments = reader.segments.filter(segment => segment.id !== word.id)
    const readerUpdate = { ...reader }
    readerUpdate.segments = updatedSegments
    console.log(updatedSegments.length, reader.segments.length)
    localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(readerUpdate))
    const localData = localStorage.getItem(`langReader-${reader.id}`)
    const localReader = JSON.parse(localData)
    setReader(localReader)
    setSelection(null)
  }

  const handleTab = (event: React.SyntheticEvent<Element, Event>, newTab: number) => {
    setTab(newTab)
  }

  function a11yProps(index: number) {
    return {
      id: `reader-tab-${index}`,
      'aria-controls': `reader-tabpanel-${index}`,
    };
  }

  const exportAnkiDeck = async (flashCards: { segment: string, hiragana: string }[], deckName: string) => {
    const url = `api/ankicards`
    const options = {
      method: 'POST',
      body: JSON.stringify({ flashCards, deckName }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, options).catch(error => console.log(error))
    const blob = await response.blob()
    saveAs(blob, `${deckName}.apkg`)
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', paddingBottom: '20px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTab} aria-label="reader tabs">
            <Tab label="reader" {...a11yProps(0)} />
            <Tab label="flashcards" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Box>
      {tab === 0 &&
        <Grid container spacing={1} justifyContent="center" >
          <Grid item xs={6}>
            <Paper>
              {reader && reader.segments.map((segment, index) => <span className={segment.isWordLike ? styles.segment : undefined} onClick={(() => handleClick(segment))} key={segment.id}>{segment.segment}</span>)}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={styles.selectionContainer}>
              {selection && <div className={styles.selection}><Selection word={selection} deck={deck.map((item) => item && item.segment)} onAdd={(word) => addToDeck(word)} onRemove={(word) => removeFromDeck(word)} onEdit={(word) => editSegment(word)} onDefine={(word) => handleDefine(word)} onDelete={(word) => deleteSegment(word)} onMerge={(word, direction) => mergeSegment(word, direction)} /></div>}
            </Paper>
          </Grid>
        </Grid>
      }
      {tab === 1 &&
        <div>
          <div className={styles.flashcardButtons}>
            {/* <Button className={styles.flashcardButton} variant="contained" endIcon={<Quiz />}>
              Review
            </Button> */}
            <Button className={styles.flashcardButton} onClick={() => exportAnkiDeck(deck, reader.name)} variant="contained" endIcon={<Download />}>
              Download
            </Button>
          </div>
          <WordTable deck={deck} />
        </div>
      }
    </Container>
  )
}

export default Reader