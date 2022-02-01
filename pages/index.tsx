import type { NextPage } from 'next'
import LangInput from '../components/langInput'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useCallback } from 'react';
import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

const DICT_PATH = '/static/dict/'

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [allSegments, setAllSegments] = useState([])
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selection, setSelection] = useState<object | null>(null)
  const [showForm, setShowForm] = useState(true)

  const setUp = useCallback(async () => {
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    setKuroshiro(newKuroshiro)
    // Can only use Intl.Segmenter on chrome
    const newSegmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });
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

  return (
    <div className={styles.container}>
      {isLoading && 'loading...'}
      {(showForm && !isLoading) && <LangInput handleOutput={output => handleOutput(output)}></LangInput>}
      {userInput && allSegments.map((segment, index) => <span key={`${Date.now()}${index}`} onClick={() => handleClick(segment.segment)}>{`${segment.segment}`}</span>)}
      {selection && selection.hiragana}
    </div>
  )
}

export default Home
