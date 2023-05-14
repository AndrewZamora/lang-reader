import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { Paper, Container, SpeedDial, SpeedDialIcon, SpeedDialAction, } from '@mui/material'
import { CreateSharp } from '@mui/icons-material'
import { useRouter } from 'next/router'
import ListReaders from '../components/ListReaders'
import Layout from '../components/Layout'
import Reader from '../types/Reader'

const Home: NextPage = () => {
  const [readers, setReaders] = useState<Reader[]>([])
  useEffect(() => {
    getReaders()
  }, [])

  const getReaders = () => {
    if (typeof window !== 'undefined') {
      const storedReaders = localStorage.getItem('langReaders')
      if (storedReaders) {
        setReaders(JSON.parse(storedReaders))
        return JSON.parse(storedReaders)
      }
    }
    return []
  }
  // const readersList = readers.length ? readers : getReaders()
  const handleClick = (id: string) => {
    router.push(`/Reader?id=${id}`)
  }

  const deleteReader = (id: string) => {
    const readers = getReaders()
    const updatedReaders = readers.filter((reader: { id: string }) => reader.id !== id)
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
        {(readers && readers.length) ?
          <ListReaders
            readers={readers}
            handleClick={(id: string) => handleClick(id)}
            handleDelete={(id: string) => deleteReader(id)} /> : <div>No Readers</div>}
        {/* <SpeedDial
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
        </SpeedDial> */}
      </Container>
    </Layout>
  )
}

export default Home
