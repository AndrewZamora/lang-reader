import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { Paper, Container, SpeedDial, SpeedDialIcon, SpeedDialAction, } from '@mui/material'
import { CreateSharp } from '@mui/icons-material'
import { useRouter } from 'next/router'
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
  const [readers, setReaders] = useState<Reader[]>([])

  useEffect(() => {
    console.log("useEffect 1 ")
    const storedReaders = localStorage.getItem('langReaders')
    if (storedReaders) {
      setReaders(JSON.parse(storedReaders))
    }
  }, [])

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
