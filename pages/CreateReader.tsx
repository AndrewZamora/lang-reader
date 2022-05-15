
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import { Container, CircularProgress, Box } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import Kuromoji from 'kuromoji'
const DICT_PATH = '/static/dict/'

const initTokenizer = (): Promise<object> => {
  return new Promise((resolve, reject) => {
    Kuromoji.builder({ dicPath: DICT_PATH }).build((error, tokenizer) => {
      if (error) return reject(error)
      resolve(tokenizer)
    })
  });
}
const CreateReader: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [allSegments, setAllSegments] = useState([])
  const [segmenter, setSegmenter] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [readerName, setReaderName] = useState('')
  const router = useRouter()
  const setUp = useCallback(async () => {
    setIsLoading(true)
    const tokenizer = await initTokenizer()
    setSegmenter(tokenizer)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (segmenter) return
    console.log("useEffect called")
    setUp()
  })

  const createSegments = (text: string) => {
    if (segmenter) {
      const segments = segmenter.tokenize(text)
      console.log(segments)
      return segments
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
      <button onClick={()=> createSegments("テストです")}>test</button>
      {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}><CircularProgress size={80} /></Box> : <LangInput handleOutput={output => handleOutput(output)} cancel={() => handleCancel()}></LangInput>}
    </Container>
  )
}

export default CreateReader
