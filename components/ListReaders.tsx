import React from 'react'
import { Paper } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import styles from './ListReaders.module.css'

interface ListReadersProps {
  readers: { name: string, lang: string, id: string }[],
  handleClick: Function,
  handleDelete: Function,
}

export default function ListReaders(props: ListReadersProps) {
  const { readers, handleClick, handleDelete } = props
  const deleteReader = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation()
    handleDelete(id)
  }
  const list = () => {
    return readers.map(reader => {
      return (<Paper key={reader.id}
        onClick={() => handleClick(reader.id)}
        className={styles.readerContainer}
        variant="outlined">
        <div className={styles.readerItem}>
          <div>Name: {reader.name} Lang: {reader.lang}</div>
          <div>
            <IconButton
              aria-label="delete forever"
              onClick={(event) => deleteReader(event, reader.id)}>
              <DeleteForever />
            </IconButton>
          </div>
        </div>
      </Paper>)
    })
  }
  return (<>{readers.length ? list() : (<div>No readers</div>)}</>)
}
