import type { NextPage } from 'next'
import React, { useState, useEffect, useCallback } from 'react'
import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { saveAs } from 'file-saver'
import {Paper, Container, SpeedDial, SpeedDialIcon, SpeedDialAction,  } from '@mui/material'
import { CreateSharp } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'
import ListReaders from '../components/ListReaders'


const DICT_PATH = '/static/dict/'

interface Reader {
  name: string,
  input: string,
  lang: string,
  segments: string[],
}

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [allSegments, setAllSegments] = useState([])
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selection, setSelection] = useState<object | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [deckName, setDeckName] = useState('')
  const [flashCards, setFlashCards] = useState<{ segment: string, hiragana: string }[] | []>([])
  const [readers, setReaders] = useState<Reader[]>([])

  const setUp = useCallback(async () => {
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    setKuroshiro(newKuroshiro)
    // Can only use Intl.Segmenter on chrome
    const newSegmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' })
    setSegmenterJa(newSegmenterJa)
  }, [])

  useEffect(() => {
    console.log("calls")
    const storedReaders = localStorage.getItem('langReader')
    if(storedReaders) {
      setReaders(Object.values(JSON.parse(storedReaders)))
    }
  }, [])

  useEffect(() => {
    if (segmenterJa) return
    setUp()
  })

  const createSegments = (text: string) => {
    if (segmenterJa) {
      const segments = segmenterJa.segment(text)
      setAllSegments(Array.from(segments))
    }
  }

  const handleOutput = (output: string) => {
    setUserInput(output)
    createSegments(output)
    setShowForm(false)
    console.log(output)
  }

  const handleClick = async (segment: string) => {
    if (kuroshiro) {
      console.log("kuroshiro", kuroshiro)
      const hiragana = await kuroshiro.convert(segment, { mode: "normal", to: "hiragana" }).catch(err => console.log(err))
      setSelection({ segment, hiragana })
    }
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
  const router = useRouter()
  const actions = [
    { icon: <CreateSharp />, name: 'Create Reader', onClick: () => { router.push('/CreateReader') } },
  ]

  return (
    <Container maxWidth="lg">
      <h2> All Readers</h2>
      <ListReaders readers={readers}/>
      <SpeedDial
        ariaLabel="create reader"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => action.onClick()}
          />
        ))}
      </SpeedDial>
    </Container>
  )
}

export default Home
