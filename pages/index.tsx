import type { NextPage } from 'next'
import React, { useState, useEffect, useCallback } from 'react'
import { Paper, Container, SpeedDial, SpeedDialIcon, SpeedDialAction, } from '@mui/material'
import { CreateSharp } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'
import ListReaders from '../components/ListReaders'
import Layout from '../components/Layout'

interface Reader {
  name: string,
  input: string,
  lang: string,
  segments: string[],
  id: string
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
  const [isSetUp, setIsSetUp] = useState(false)

  const setUp = useCallback(async () => {
    // Can only use Intl.Segmenter on chrome
    const newSegmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' })
    setSegmenterJa(newSegmenterJa)
    setIsSetUp(true)
  }, [])

  useEffect(() => {
    console.log("useEffect 1 ")
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      setReaders(JSON.parse(storedReaders))
    }
  }, [])

  useEffect(() => {
    console.log("useEffect 2")
    if (segmenterJa) return
    setUp()
  }, [segmenterJa])

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

  // const handleClick = async (segment: string) => {
  //   if (kuroshiro) {
  //     console.log("kuroshiro", kuroshiro)
  //     const hiragana = await kuroshiro.convert(segment, { mode: "normal", to: "hiragana" }).catch(err => console.log(err))
  //     setSelection({ segment, hiragana })
  //   }
  // }

  const handleClick = (id: string) => {
    console.log(id)
    router.push(`/Reader?id=${id}`)
  }

  const deleteReader = (id: string) => {
    const storedReaders = localStorage.getItem('langReaders')
    const readers = JSON.parse(storedReaders)
    const updatedReaders = readers.filter(reader => reader.id !== id)
    setReaders(updatedReaders)
    localStorage.setItem('langReaders', JSON.stringify(updatedReaders))
    localStorage.removeItem(`langReader-${id}`)
  }

  const router = useRouter()
  const actions = [
    { icon: <CreateSharp />, name: 'Create Reader', onClick: () => { router.push('/CreateReader') } },
  ]

  return (
    <Layout>
    <Container maxWidth="lg">
      <h2> All Readers</h2>
      <ListReaders
        readers={readers}
        handleClick={(id: string) => handleClick(id)}
        handleDelete={(id: string) => deleteReader(id)} />
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
    </Layout>
  )
}

export default Home
