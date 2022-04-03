
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

interface WordTableProps {
  deck: {
    segment: string,
    hiragana: string,
  }[],
}

const WordTable = (props: WordTableProps) => {
  const { deck } = props
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Segment</TableCell>
            <TableCell align="left">Reading</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deck.map((card) => (
            <TableRow
              key={card.segment}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{card.segment}</TableCell>
              <TableCell align="left">{card.hiragana}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default WordTable
