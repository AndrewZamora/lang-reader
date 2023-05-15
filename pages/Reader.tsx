
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Quiz, Download, Edit as EditIcon } from '@mui/icons-material'
import { Paper, Container, Grid, Tabs, Tab, Box, Button, Pagination } from '@mui/material'
import { useRouter } from 'next/router'
// @ts-ignore
import Kuroshiro from 'kuroshiro'
// @ts-ignore
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import Selection from '../components/Selection'
import WordTable from '../components/WordTable'
import { saveAs } from 'file-saver'
import styles from './Reader.module.css'
import Layout from '../components/Layout'
import { jsonToCsv } from '../utilities/createFile'
import Deck from '../types/Deck'
import Reader from '../types/Reader'
const DICT_PATH = '/static/dict/'

const Reader: NextPage = () => {
  const router = useRouter()
  const [reader, setReader] = useState<Reader | null>(null)
  const [selection, setSelection] = useState<Deck | null>(null)
  // TODO: REMOVE ANY
  const [kuroshiro, setKuroshiro] = useState<object | any>(null)
  const [deck, setDeck] = useState<Deck[]>([])
  const [tab, setTab] = useState(0)

  const setUp = useCallback(async () => {
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    setKuroshiro(newKuroshiro)
  }, [])

  const getReader = () => {
    const { id } = router.query
    if (id) {
      const localData = localStorage.getItem(`langReader-${id}`)
      if (localData) {
        const localReader = JSON.parse(localData)
        setReader(localReader)
        if (localReader.deck) {
          setDeck(localReader.deck)
        }
      }
    }
  }

  useEffect(() => {
    console.log("useEffect reader")
    if (kuroshiro) return
    setUp()
    getReader()
  }, [kuroshiro])

  const getHiragana = async (segment: string) => {
    if (kuroshiro) {
      const hiragana = await kuroshiro.convert(segment, { to: 'hiragana' })
      return hiragana
    } else {
      return segment
    }
  }

  const getDefinition = async (search: string) => {
    const word = encodeURIComponent(search)
    const response = await fetch(`api/definition?word=${word}`).catch(error => console.log(error))
    if (response?.json) {
      const json = await response.json()
      return json.data
    }
  }

  const handleDefine = async (segment: Deck):Promise<string> => {
    const definition = await getDefinition(segment.segment)
    if (definition.length && definition[0] && definition[0].senses.length && definition[0].senses[0].english_definitions.length) {
      return definition[0].senses[0].english_definitions[0]
    } else {
      return ''
    }
  }

  const updateReader = (id: string, update: object) => {
    const readerId = `langReader-${id}`
    localStorage.setItem(readerId, JSON.stringify(update))
    const localData = localStorage.getItem(readerId)
    if (localData) {
      const localReader = JSON.parse(localData)
      setReader(localReader)
    }
  }

  const handleClick = async (segment: Deck) => {
    const hiragana = await getHiragana(segment.segment)
    let newSelection = { ...segment, hiragana }
    if (segment.definition) {
      newSelection.definition = segment.definition
    }
    setSelection(newSelection)
  }

  const addToDeck = (word: Deck) => {
    const deckUpdate = [...deck, word]
    setDeck(deckUpdate)
    const readerUpdate = { ...reader, deck: deckUpdate }
    if (reader) {
      updateReader(reader.id, readerUpdate)
    }
  }

  const removeFromDeck = (word: Deck) => {
    if (deck.length) {
      const deckUpdate = deck.filter((card: Deck) => card.segment !== word.segment)
      setDeck(deckUpdate)
      const readerUpdate = { ...reader, deck: deckUpdate }
      if (reader) {
        updateReader(reader.id, readerUpdate)
      }
    }
  }

  const mergeSegment = async (word: Deck, direction: 'left' | 'right') => {
    if (reader) {
      const wordIndex: number = reader.segments.findIndex(segment => segment.id === word.id)
      const directions = { right: 1, left: -1 }
      const selectionIndex = parseInt(`${wordIndex + directions[direction]}`)
      const mergeSelection = reader.segments[selectionIndex]
      if (mergeSelection.isWordLike) {
        let mergedWord = { ...word }
        mergedWord.segment = direction === 'right' ? `${mergedWord.segment}${mergeSelection.segment}` : `${mergeSelection.segment}${mergedWord.segment}`
        const hiragana = await getHiragana(mergedWord.segment)
        mergedWord.hiragana = hiragana
        let readerUpdate = { ...reader }
        readerUpdate.segments[wordIndex] = mergedWord
        readerUpdate.segments = readerUpdate.segments.filter(segment => segment.id !== mergeSelection.id)
        updateReader(reader.id, readerUpdate)
        setSelection(mergedWord)
      }
    }
  }

  const editSegment = (word: Deck) => {
    if (reader) {
      const updatedSegments = reader.segments.map(segment => {
        if (segment.id === word.id) {
          return word
        }
        return segment
      })
      const readerUpdate = { ...reader }
      readerUpdate.segments = updatedSegments
      updateReader(reader.id, readerUpdate)
      setSelection(word)
    }
  }

  const deleteSegment = (word: Deck) => {
    if (reader) {
      const updatedSegments = reader.segments.filter(segment => segment.id !== word.id)
      const readerUpdate = { ...reader }
      readerUpdate.segments = updatedSegments
      updateReader(reader.id, readerUpdate)
      setSelection(null)
    }
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

  const handleDownload = async () => {
    if (!reader) return
    const json = deck.map((card) => {
      const {
        segment,
        hiragana,
        definition
      } = card
      return { segment, reading: hiragana, definition }
    })
    const csv = jsonToCsv(json)
    const blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, `${reader.name}.csv`)
  }

  const handleSegmentElement = (segment: Deck) => {
    if (segment.isWordLike) {
      return (<span className={styles.segment}
        onClick={(() => handleClick(segment))}
        key={segment.id}>{segment.segment}</span>)
    }
    return (<span key={segment.id}>{segment.segment}</span>)
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <h2>{reader && reader.name && reader.name}</h2>
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
              <Paper style={{maxHeight: '50vh', overflow: 'auto'}}>
                {reader?.segments && reader.segments.map(segment => handleSegmentElement(segment))}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={styles.selectionContainer}>
                {selection && <div className={styles.selection}><Selection word={selection}
                  deck={deck.map((item) => item && item.segment)}
                  onAdd={(word: Deck) => addToDeck(word)}
                  onRemove={(word: Deck) => removeFromDeck(word)}
                  onEdit={(word: Deck) => editSegment(word)}
                  onDefine={(word: Deck) => handleDefine(word)}
                  onDelete={(word: Deck) => deleteSegment(word)}
                  onMerge={(word: Deck, direction: 'left' | 'right') => mergeSegment(word, direction)} /></div>}
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
              <Button className={styles.flashcardButton} onClick={() => handleDownload()} variant="contained" endIcon={<Download />}>
                Export to CSV
              </Button>
            </div>
            {deck.length && <WordTable deck={deck} />}
          </div>
        }
      </Container>
      {reader && reader.source &&
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button variant="outlined" href={reader.source}>
            Source
          </Button>
        </Grid>
      }
    </Layout>
  )
}

export default Reader