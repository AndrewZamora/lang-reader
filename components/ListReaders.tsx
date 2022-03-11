import React from 'react'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface ListReadersProps {
  readers: { name: string, lang: string, id: string }[]
}

export default function ListReaders(props: ListReadersProps) {
  const useStyles = makeStyles({
    readerItem: {
      padding: '1em 1.5em',
    },
    readerContainer: {
      marginBottom: '0.5em',
      cursor: 'pointer'
    }
  })
  const classes = useStyles()
  const { readers } = props
  return readers.length ? (
    readers.map(reader => {
      return <Paper key={reader.id} className={classes.readerContainer} variant="outlined"><div className={classes.readerItem}>Name: {reader.name} Lang: {reader.lang}</div></Paper>
    })
  ) : (<div>No readers</div>)
}
