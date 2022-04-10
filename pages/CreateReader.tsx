
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
      return Array.from(segments)
    }
  }
  interface output {
    text: string,
    name: string
  }

  const getDefinition = async (search: string) => {
    const word = encodeURIComponent(search)
    const response = fetch(`api/definition?word=${word}`).catch(error => console.log(error))
    const json = await (await response).json()
    return json.data
  }

  const handleOutput = async (output: output) => {
    setUserInput(output.text)
    setReaderName(output.name)
    const segments = createSegments(output.text)
    const segmentDefRequests = segments?.map(async (segment) => {
      if (segment.isWordLike) {
        const definition = await getDefinition(segment.segment)
        segment.definition = definition[0] && definition[0]['senses'][0] && definition[0]['senses'][0] && ['english_definitions'][0] ? definition[0]['senses'][0]['english_definitions'][0] : null
      }
      return segment
    })
    const segmentsWithDef = await Promise.all(segmentDefRequests).catch(err => console.log(err))
    setAllSegments(segmentsWithDef)
  }


  useEffect(() => {
    // https://stackoverflow.com/questions/56247433/how-to-use-setstate-callback-on-react-hooks
    if (allSegments.length) {
      let readers
      const reader = { name: readerName, lang: 'ja', input: userInput, segments: allSegments, id: uuidv4() }
      const { input, segments, ...readerNoInputOrSegments } = reader;
      const data = localStorage.getItem('langReaders')
      readers = data ? JSON.parse(data) : []
      readers = [...readers, readerNoInputOrSegments]
      localStorage.setItem('langReaders', JSON.stringify(readers))
      localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(reader))
      router.push('/')
    }
  }, [allSegments])

  return (
    <Container maxWidth="lg">
      <h2>Create Reader</h2>
      <LangInput handleOutput={output => handleOutput(output)}></LangInput>
    </Container>
  )
}

export default CreateReader
