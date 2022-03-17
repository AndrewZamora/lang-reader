import React from 'react'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DeleteForever } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'

interface ListReadersProps {
  readers: { name: string, lang: string, id: string }[],
  handleClick: Function
}

export default function ListReaders(props: ListReadersProps) {
  const useStyles = makeStyles({
    readerItem: {
      padding: '1em 1.5em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    readerContainer: {
      marginBottom: '0.5em',
      cursor: 'pointer',
    }
  })
  const deleteReader = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,id: string) => {
    event.stopPropagation()
    const storedReaders = localStorage.getItem('langReaders')
    const readers = JSON.parse(storedReaders)
    const updatedReaders = readers.filter(reader => reader.id !== id)
    localStorage.setItem('langReaders', JSON.stringify(updatedReaders))
    localStorage.removeItem(`langReader-${id}`)
  }
  const classes = useStyles()
  const { readers, handleClick } = props
  return readers.length ? (
    readers.map(reader => {
      return <Paper key={reader.id} onClick={() => handleClick(reader.id)} className={classes.readerContainer} variant="outlined">
        <div className={classes.readerItem}>Name: {reader.name} Lang: {reader.lang}
          <div>
            <IconButton aria-label="delete forever" onClick={(event) => deleteReader(event,reader.id)}>
              <DeleteForever />
            </IconButton>
          </div>
        </div>
      </Paper>
    })
  ) : (<div>No readers</div>)
}
