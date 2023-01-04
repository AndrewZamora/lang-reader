
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Quiz, Download, Edit as EditIcon } from '@mui/icons-material'
import { Paper, Container, Grid, Tabs, Tab, Box, Button, Pagination } from '@mui/material'
import { useRouter } from 'next/router'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import Selection from '../components/Selection'
import WordTable from '../components/WordTable'
import { saveAs } from 'file-saver'
import styles from './Reader.module.css'
import Layout from '../components/Layout'

const DICT_PATH = '/static/dict/'

const Reader: NextPage = () => {
  const router = useRouter()
  const [reader, setReader] = useState<object | null>(null)
  const [selection, setSelection] = useState<object | null>(null)
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [deck, setDeck] = useState([])
  const [tab, setTab] = useState(0)
  const [pages, setPages] = useState({})
  const [pageIndex, setPageIndex] = useState(0)

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

  const handlePages = () => {
    let pages = {}
    let currentPage = 0
    let limit = 50
    for (const [index, segment] of reader.segments.entries()) {
      if (!pages[`${currentPage}`]) {
        pages[`${currentPage}`] = []
        pages[`${currentPage}`].push(index)
      }
      if (segment.segment === '。' && (index - pages[`${currentPage}`][0]) >= limit) {
        pages[`${currentPage}`].push(index)
        currentPage += 1
      }
    }
    setPages(pages)
  }

  useEffect(() => {
    if (reader) {
      handlePages()
    }
  }, [deck, reader])

  const getHiragana = async (segment: object) => {
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

  const handleDefine = async (segment: object) => {
    const definition = await getDefinition(segment.segment)
    if (definition.length && definition[0] && definition[0].senses.length && definition[0].senses[0].english_definitions.length) {
      return definition[0].senses[0].english_definitions[0]
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

  const handleClick = async (segment: object) => {
    const hiragana = await getHiragana(segment.segment)
    let newSelection = { ...segment, hiragana }
    if (segment.definition) {
      newSelection.definition = segment.definition
    }
    setSelection(newSelection)
  }

  const addToDeck = (word: object) => {
    const deckUpdate = [...deck, word]
    setDeck(deckUpdate)
    const readerUpdate = { ...reader, deck: deckUpdate }
    updateReader(reader.id, readerUpdate)
  }

  const removeFromDeck = (word: object) => {
    if (deck.length) {
      const deckUpdate = deck.filter(card => card.segment !== word.segment)
      setDeck(deckUpdate)
      const readerUpdate = { ...reader, deck: deckUpdate }
      updateReader(reader.id, readerUpdate)
    }
  }

  const mergeSegment = async (word: object, direction: string) => {
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
      updateReader(reader.id, readerUpdate)
      setSelection(mergedWord)
    }
  }

  const editSegment = (word) => {
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

  const deleteSegment = (word) => {
    const updatedSegments = reader.segments.filter(segment => segment.id !== word.id)
    const readerUpdate = { ...reader }
    readerUpdate.segments = updatedSegments
    updateReader(reader.id, readerUpdate)
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

  const handleSegmentElement = (segment) => {
    if (segment.isWordLike) {
      return (<span className={styles.segment}
        onClick={(() => handleClick(segment))}
        key={segment.id}>{segment.segment}</span>)
    }
    return (<span key={segment.id}>{segment.segment}</span>)
  }

  const handlePageChange = (page: number) => {
    setPageIndex(page - 1)
  }

  const createReaderPage = () => {
    const page = pages[`${pageIndex}`]
    if ( page && page.length && reader) {
      return reader.segments.slice(page[0], page[1]).map((segment) => handleSegmentElement(segment))
    }
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
              <Paper>
                {createReaderPage()}
              </Paper>
              <div className={styles.pagination}>
                {Object.keys(pages).length > 1 && <Pagination onChange={(event, page) => handlePageChange(page)} count={Object.keys(pages).length} variant="outlined" shape="rounded" />}
              </div>
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