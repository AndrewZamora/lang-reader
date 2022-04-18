
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import { Container, CircularProgress, Box } from '@mui/material'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
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
    // const newKuroshiro = new Kuroshiro()
    // await newKuroshiro.init(new KuromojiAnalyzer({
    // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
    // dictPath: DICT_PATH,
    // }))
    // setKuroshiro(newKuroshiro)
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

  const asyncQueue = async (array, queueAmount: number, callback) => {
    let queue = []
    let queueIndex = 0
    let results = []
    const timeout = () => new Promise(resolve => setTimeout(resolve, 3000))
    for (let i = 0; i < array.length; i++) {
      if (queue[queueIndex]) {
        queue[queueIndex].push(callback(array[i]));
        if (queue[queueIndex].length === queueAmount || array.length - 1 === i) {
          results = [...results, ...await Promise.all(queue[queueIndex])]
          await timeout()
          queueIndex += 1
        }
      } else {
        queue[queueIndex] = [callback(array[i])]
      }
    }
    return results
  }

  const getDefinition = async (search: string) => {
    const word = encodeURIComponent(search)
    const response = fetch(`api/definition?word=${word}`).catch(error => console.log(error))
    const json = await (await response).json()
    return json.data
  }

  const handleOutput = async (output: output) => {
    setIsLoading(true)
    setUserInput(output.text)
    setReaderName(output.name)
    const segments = createSegments(output.text)
    const handleDefinitions = async segment => {
      if (segment.isWordLike) {
        const definition = await getDefinition(segment.segment)
        segment.definition = definition[0] && definition[0]['senses'][0] && definition[0]['senses'][0] && ['english_definitions'][0] ? definition[0]['senses'][0]['english_definitions'][0] : null
      }
      segment.id = uuidv4()
      return segment
    }
    const segmentsWithDef = await asyncQueue(segments, 8, handleDefinitions)
    setAllSegments(segmentsWithDef)
  }

  const handleCancel = () => {
    router.push('/')
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
      { isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}><CircularProgress size={80} /></Box>  : <LangInput handleOutput={output => handleOutput(output)} cancel={()=> handleCancel()}></LangInput>}
    </Container>
  )
}

export default CreateReader
