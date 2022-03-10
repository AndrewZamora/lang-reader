
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const DICT_PATH = '/static/dict/'

const CreateReader: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [allSegments, setAllSegments] = useState([])
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setUp = useCallback(async () => {
    setIsLoading(true)
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    setKuroshiro(newKuroshiro)
    // Can only use Intl.Segmenter on chrome
    const newSegmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' })
    setSegmenterJa(newSegmenterJa)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (segmenterJa) return
    setUp()
  })

  const createSegments = (text: string) => {
    if (segmenterJa) {
      const segments = segmenterJa.segment(text)
      setAllSegments(Array.from(segments))
      console.log({userInput, segments: allSegments})
    }
  }
  interface output {
  text: string,
  name: string
}

  const handleOutput = async (output: output) => {
    setUserInput(output.text)
    createSegments(output.text)
  }

  return (
    <Container maxWidth="lg">
      <h2>Create Reader</h2>
      <LangInput handleOutput={output => handleOutput(output)}></LangInput>
    </Container>
  )
}

export default CreateReader
