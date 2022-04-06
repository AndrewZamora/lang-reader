
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import * as cheerio from 'cheerio';

const DICT_PATH = '/static/dict/'

const CreateReader: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [allSegments, setAllSegments] = useState([])
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [readerName, setReaderName] = useState('')
  const router = useRouter()
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
    }
  }
  interface output {
    text: string,
    name: string
  }

  const handleOutput = async (output: output) => {
    setUserInput(output.text)
    createSegments(output.text)
    setReaderName(output.name)
  }

  const test = async(search: string) => {
    const word = encodeURIComponent(search)
    const response = fetch(`api/definition?word=${word}`).catch(error => console.log(error))
    const json = await (await response).json()
    console.log({json})
    // const {} = await (await response).json()
    // console.log({done})
  //   const $ = cheerio.load('https://jisho.org/api/v1/search/words');
  //  console.log( $.html());
  }

  useEffect(() => {
    // https://stackoverflow.com/questions/56247433/how-to-use-setstate-callback-on-react-hooks
    if (allSegments.length) {
      let readers 
      const reader = { name: readerName, lang: 'ja', input: userInput, segments: allSegments, id: uuidv4() }
      const {input, segments, ...readerNoInputOrSegments} = reader;
      const data = localStorage.getItem('langReaders')
      readers = data ? JSON.parse(data) : []
      readers = [...readers, readerNoInputOrSegments]
      localStorage.setItem('langReaders', JSON.stringify(readers))
      localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(reader) )
      router.push('/')
    }
  }, [allSegments])

  return (
    <Container maxWidth="lg">
      <h2>Create Reader</h2>
      <LangInput handleOutput={output => handleOutput(output)}></LangInput>
      <button onClick={test}>test</button>
    </Container>
  )
}

export default CreateReader
