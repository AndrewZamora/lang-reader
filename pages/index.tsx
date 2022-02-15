import type { NextPage } from 'next'
import LangInput from '../components/LangInput'
import Selection from '../components/Selection'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useCallback } from 'react'
import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { saveAs } from 'file-saver'

const DICT_PATH = '/static/dict/'

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [allSegments, setAllSegments] = useState([])
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selection, setSelection] = useState<object | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [flashCards, setFlashCards] = useState<{ segment: string, hiragana: string }[] | []>([])

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

  const exportAnkiDeck = async (flashCards: { segment: string, hiragana: string }[]) => {
    const deckName = "testdeckname2"
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
    <div className={styles.container}>
      {isLoading && 'loading...'}
      {(showForm && !isLoading) && <LangInput handleOutput={output => handleOutput(output)}></LangInput>}
      <div className={styles.content}>
        <div>
          {userInput && allSegments.map((segment, index) => <span className={styles.segment} key={`${Date.now()}${index}`} onClick={() => handleClick(segment.segment)}>{`${segment.segment}`}</span>)}
        </div>
        {selection && <Selection whitelist={flashCards.map(segment => segment.segment)} word={selection} onAddToDeck={(card) => setFlashCards([...flashCards, card])}></Selection>}
        <div>
          {flashCards.length > 0 && flashCards.map(segment => <span>{segment.segment}</span>)}
        </div>
        <button onClick={() => exportAnkiDeck(flashCards)}>create anki cards</button>
      </div>
    </div>
  )
}

export default Home
