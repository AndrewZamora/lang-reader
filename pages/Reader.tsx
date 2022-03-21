
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Paper, Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'

const Reader: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [reader, setReader] = useState<object | null>(null)
  const [selection, setSelection] = useState('')

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
    },
    h2: {
      border: "pink solid 2px"
    }
  })

  const classes = useStyles()
  const handleClick = (segment: string) => {
    console.log(segment)
    setSelection(segment)
  }
  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
      <Grid container spacing={1} >
        <Grid item xs={5}>
          <Paper>
            {reader && reader.segments.map((segment, index) => <span className={segment.isWordLike ? classes.segment : undefined} onClick={(() => handleClick(segment.segment))} key={segment.segment + index}>{segment.segment}</span>)}
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <h2>{selection}</h2>
        </Grid>

      </Grid>
    </Container>
  )
}

export default Reader