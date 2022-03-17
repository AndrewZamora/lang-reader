
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'

const Reader: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [reader, setReader] = useState<object | null>(null)

  useEffect(() => {
    console.log("useEffect reader page")
    const localData = localStorage.getItem(`langReader-${id}`)
    const localReader = JSON.parse(localData)
    console.log(localReader, id)
    setReader(localReader)
  }, [])

  const useStyles = makeStyles({
    segment: {
      border: 'lightblue solid 1px',
      borderRadius: "5px",
      cursor: 'pointer',
      fontSize: '30px',
      '&:hover': {
        background: 'lightblue'
      }
    }
  })

  const classes = useStyles()
  const handleClick=(segment: string) => {
    console.log(segment)
  }
  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
      {reader && reader.segments.map((segment, index) => <span className={segment.isWordLike ? classes.segment : undefined } onClick={(()=> handleClick(segment.segment))} key={segment.segment + index}>{segment.segment}</span>)}
    </Container>
  )
}

export default Reader