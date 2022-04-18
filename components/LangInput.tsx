import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import { makeStyles } from '@mui/styles'
import { Button, Grid, FormControl, TextField, Box, Modal } from '@mui/material'

interface LangInputProps {
  handleOutput(output: string): void,
  cancel(): void,
}

const LangInput = (props: LangInputProps) => {
  const { handleOutput, cancel } = props
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [source, setSource] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const handleOpen = () => setOpenModal(true)
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
        name
      }
      handleOutput(output)
      setInput('')
    }
  }

  const handleFile = async (event) => {
    console.log(event)
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const FR = new FileReader()
      FR.addEventListener("load", async function (e) {
        const url = `api/imageToText`
        const options = {
          method: 'POST',
          body: e.target.result,
          headers: {
          }
        }
        const response = await fetch(url, options).catch(error => console.log({error}))
        const {text} = await response.json()
        setInput(text.replace(/\s/g,''))
      })
      FR.readAsDataURL(file)
    }
  }

  const useStyles = makeStyles({
    btn: {
      marginTop: '20px'
    },
    input: {
      marginBottom: '10px'
    },
  })

  const classes = useStyles()

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>Import Image Text</Button>
      <form noValidate autoComplete='off' onSubmit={event => handleSubmit(event)}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <TextField
            className={classes.input}
            id="reader-name-input"
            label="Reader Name"
            variant="outlined"
            onChange={event => handleName(event)}
            value={name}
          />
          <TextField
            className={classes.input}
            id="reader-source-input"
            label="Reader Source"
            variant="outlined"
            onChange={event => handleSource(event)}
            value={source}
          />
          <TextField
            className={classes.input}
            id="reader-text-input"
            label="Reader Text"
            multiline
            variant="outlined"
            minRows={20}
            onChange={event => handleInput(event)}
            value={input}
            fullWidth
          />
        </FormControl>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
        >
          <Button variant="outlined" className={classes.btn} onClick={() => cancel()}>Cancel</Button>
          <Button variant="outlined" className={classes.btn} type="submit">Create</Button>
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
