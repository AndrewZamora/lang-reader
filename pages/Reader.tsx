
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import { useRouter } from 'next/router'


const Reader: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [reader, setReader] = useState<object | null>(null)

  useEffect(() => {
    console.log("useEffect reader page")
    const localData = localStorage.getItem(`langReader-${id}`)
    const localReader  = JSON.parse(localData)
    console.log(localReader)
    setReader(localReader)
  },[])

  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
    </Container>
  )
}

export default Reader