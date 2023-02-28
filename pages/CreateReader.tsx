
import React, { useState, useEffect, useCallback } from 'react'
import LangInput from '../components/LangInput'
import type { NextPage } from 'next'
import { Container, CircularProgress, Box } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import Kuromoji from 'kuromoji'
import Layout from '../components/Layout'
import Reader from './Reader'
const DICT_PATH = '/static/dict/'

const initTokenizer = (): Promise<object> => {
  return new Promise((resolve, reject) => {
    Kuromoji.builder({ dicPath: DICT_PATH }).build((error, tokenizer) => {
      if (error) return reject(error)
      resolve(tokenizer)
    })
  });
}

interface Reader {
  name: string,
  input: string,
  lang: string,
  segments: object[],
  id: string,
  source?: string, 
}
interface Word {
  segment: string,
  isWordLike: boolean,
  id: string,
  definition?: string
}

const CreateReader: NextPage = () => {
  // TODO: REMOVE ANY
  const [segmenter, setSegmenter] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
  }, [])

  const createSegments = (text: string): object[] => {
    if (segmenter) {
      const segments = segmenter.tokenize(text)
      return segments.map((segment: { pos: string; surface_form: string }) => {
        const notWords = ['記号']
        const isWordLike = !notWords.includes(segment.pos)
        let result: Word = {
          segment: segment.surface_form,
          isWordLike,
          id: uuidv4(),
        }
        if (isWordLike) {
          // https://jisho.org/forum/607ba7c9d5dda7783f000000-rate-limiting-on-api-and-search
          // Will need to find a better solution
          result.definition = ''
        }
        return result
      })
    }
    return []
  }
  interface output {
    text: string,
    name: string,
    source: string,
  }

  const createReader = (reader: Reader) => {
    let readers
    const { input, segments, ...readerNoInputOrSegments } = reader;
    const data = localStorage.getItem('langReaders')
    readers = data ? JSON.parse(data) : []
    readers = [...readers, readerNoInputOrSegments]
    localStorage.setItem('langReaders', JSON.stringify(readers))
    localStorage.setItem(`langReader-${reader.id}`, JSON.stringify(reader))
  }

  const handleOutput = async (output: output) => {
    setIsLoading(true)
    const { source, name, text } = output
    const segments = createSegments(output.text)
    if (segments?.length) {
      const reader: Reader = { name, lang: 'ja', input: text, segments, id: uuidv4(), source }
      createReader(reader)
      router.push('/')
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <h2>Create Reader</h2>
        {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}><CircularProgress size={80} /></Box> : <LangInput handleOutput={(output: output) => handleOutput(output)} cancel={() => handleCancel()}></LangInput>}
      </Container>
    </Layout>
  )
}

export default CreateReader
