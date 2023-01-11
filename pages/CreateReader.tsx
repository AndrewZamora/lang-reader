
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import { Container, CircularProgress, Box } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import Kuromoji from 'kuromoji'
import Layout from '../components/Layout'
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
  const [allSegments, setAllSegments] = useState([])
  const [segmenter, setSegmenter] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [readerName, setReaderName] = useState('')
  const [readerSource, setReaderSource] = useState('')
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
      return segments.map(segment => {
        const notWords = ['記号']
        return {
          segment: segment.surface_form,
          isWordLike: !notWords.includes(segment.pos)
        }
      })
    }
  }
  interface output {
    text: string,
    name: string
  }

  const handleOutput = async (output: output) => {
    setIsLoading(true)
    setUserInput(output.text)
    setReaderName(output.name)
    setReaderSource(output.source)
    const segments = createSegments(output.text)
    // const handleDefinitions = async segment => {
    const handleDefinitions = segment => {
      if (segment.isWordLike) {
        segment.definition = ''
      }
      segment.id = uuidv4()
      return segment
    }
    // https://jisho.org/forum/607ba7c9d5dda7783f000000-rate-limiting-on-api-and-search
    // Will need to find a better solution
    // const segmentsWithDef = await asyncQueue(segments, 9, handleDefinitions)
    const segmentsWithDef = segments.map((segment)=> handleDefinitions(segment))
    setAllSegments(segmentsWithDef)
  }

  const handleCancel = () => {
    router.push('/')
  }


  useEffect(() => {
    // https://stackoverflow.com/questions/56247433/how-to-use-setstate-callback-on-react-hooks
    if (allSegments.length) {
      let readers
      const reader = { name: readerName, lang: 'ja', input: userInput, segments: allSegments, id: uuidv4(), source: readerSource }
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
    <Layout>
      <Container maxWidth="lg">
        <h2>Create Reader</h2>
        {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}><CircularProgress size={80} /></Box> : <LangInput handleOutput={output => handleOutput(output)} cancel={() => handleCancel()}></LangInput>}
      </Container>
    </Layout>
  )
}

export default CreateReader
