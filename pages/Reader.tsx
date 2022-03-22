
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { Paper, Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'

const Reader: NextPage = () => {
  const router = useRouter()
  const [reader, setReader] = useState<object | null>(null)
  const [selection, setSelection] = useState('')

  useEffect(() => {
    const { id } = router.query
    console.log("useEffect reader page")
    if (id) {
      const localData = localStorage.getItem(`langReader-${id}`)
      const localReader = JSON.parse(localData)
      console.log(localReader, id)
      setReader(localReader)
    }
  }, [router])

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
    selection: {
      fontSize: "40px"
    },
    selectionContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }
  })

  const classes = useStyles()
  const handleClick = (segment) => {
    console.log(segment)
    setSelection(segment.segment)
  }
  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
      <Grid container spacing={1} justifyContent="center" >
        <Grid item xs={6}>
          <Paper>
            {reader && reader.segments.map((segment, index) => <span className={segment.isWordLike ? classes.segment : undefined} onClick={(() => handleClick(segment))} key={segment.segment + index}>{segment.segment}</span>)}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.selectionContainer}>

            {selection && <p className={classes.selection}>{selection}</p>}

          </Paper>
        </Grid>

      </Grid>
    </Container>
  )
}

export default Reader