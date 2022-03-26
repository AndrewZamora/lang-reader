
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Paper, Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'
import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { Segment } from '@mui/icons-material'
import Selection from '../components/Selection'

const DICT_PATH = '/static/dict/'

const Reader: NextPage = () => {
  const router = useRouter()
  const [reader, setReader] = useState<object | null>(null)
  const [selection, setSelection] = useState<object | null>(null)
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [deck, setDeck] = useState([])

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

  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
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
    </Container>
  )
}

export default Reader