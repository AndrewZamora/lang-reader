import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import { Button, Grid, FormControl, TextField, Box, Modal } from '@mui/material'
import { createWorker } from 'tesseract.js'
import styles from './LangInput.module.css'

interface LangInputProps {
  handleOutput(output: object): void,
  cancel(): void,
}

const LangInput = (props: LangInputProps) => {
  const { handleOutput, cancel } = props
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [source, setSource] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [worker, setWorker] = useState(null || Object)

  const handleOpen = () => {
    const newWorker = createWorker();
    setWorker(newWorker)
    setOpenModal(true)
  }

  const handleClose = () => setOpenModal(false)

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSource = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input && name) {
      const output = {
        text: DOMPurify.sanitize(input),
        name,
        source
      }
      handleOutput(output)
      setInput('')
    }
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    if (event.target.files && event.target.files[0] && worker) {
      setOpenModal(false)
      const file = event.target.files[0]
      await worker.load();
      await worker.loadLanguage('jpn');
      await worker.initialize('jpn');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      setInput(text.replace(/\s/g, ''))
    }
  }

  return (
    <div>
      <Button variant="outlined" className={styles.imageTextBtn} onClick={handleOpen}>Import Image Text</Button>
      <form noValidate autoComplete='off' onSubmit={event => handleSubmit(event)}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <TextField
            className={styles.input}
            id="reader-name-input"
            label="Reader Name"
            variant="outlined"
            onChange={handleName}
            value={name}
          />
          <TextField
            className={styles.input}
            id="reader-source-input"
            label="Reader Source"
            variant="outlined"
            onChange={handleSource}
            value={source}
          />
          <TextField
            className={styles.input}
            id="reader-text-input"
            label="Reader Text"
            multiline
            variant="outlined"
            minRows={20}
            onChange={handleInput}
            value={input}
            fullWidth
          />
        </FormControl>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Button variant="outlined" className={styles.btn} onClick={cancel}>Cancel</Button>
          <Button variant="outlined" className={styles.btn} type="submit">Create</Button>
        </Grid>
      </form>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
          <input type="file" onChange={handleFile} />
        </Box>
      </Modal>
    </div>
  )
}

export default LangInput
