
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Quiz, Download } from '@mui/icons-material'
import { Paper, Container, Grid, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'
import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import Selection from '../components/Selection'

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
      const localReader = JSON.parse(localData)
      console.log(localReader, id)
      setReader(localReader)
      if (localReader.deck) {
        setDeck(localReader.deck)
      }
    }
  }, [router])

  const useStyles = makeStyles({
    segment: {
      border: 'lightblue solid 1px',
      borderRadius: "5px",
      cursor: 'pointer',
      fontSize: '30px',
      '&:hover': {
        background: 'lightblue'
      }
    },
    selection: {
      fontSize: "40px"
    },
    selectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    flashcardButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    flashcardButton: {
      margin: '5px 5px 0 0'
    }
  })

  const classes = useStyles()
  const getHiragana = async (segment) => {
    if (kuroshiro) {
      const hiragana = await kuroshiro.convert(segment, { to: 'hiragana' })
      return hiragana
    } else {
      return segment
    }
  }
  const handleClick = async (segment) => {
    const hiragana = await getHiragana(segment.segment)
    let newSelection = {
      segment: segment.segment,
      hiragana
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

  const handleTab = (event, newTab) => {
    setTab(newTab)
  }

  function a11yProps(index: number) {
    return {
      id: `reader-tab-${index}`,
      'aria-controls': `reader-tabpanel-${index}`,
    };
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
              {reader && reader.segments.map((segment, index) => <span className={segment.isWordLike ? classes.segment : undefined} onClick={(() => handleClick(segment))} key={segment.segment + index}>{segment.segment}</span>)}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.selectionContainer}>
              {selection && <Selection word={selection} deck={deck.map((item) => item && item.segment)} onAdd={(word) => addToDeck(word)} onRemove={(word) => removeFromDeck(word)} />}
            </Paper>
          </Grid>
        </Grid>
      }
      {tab === 1 &&
        <div>
          <TableContainer component={Paper}>
            <div className={classes.flashcardButtons}>
              <Button className={classes.flashcardButton} variant="contained" endIcon={<Quiz />}>
                Review
              </Button>
              <Button className={classes.flashcardButton} variant="contained" endIcon={<Download />}>
                Download
              </Button>
            </div>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Segment</TableCell>
                  <TableCell align="left">Reading</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deck.map((card) => (
                  <TableRow
                    key={card.segment}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">{card.segment}</TableCell>
                    <TableCell align="left">{card.hiragana}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      }
    </Container>
  )
}

export default Reader