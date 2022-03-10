
import React, { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'


const Reader: NextPage = () => {

const testData = {
	"userInput": "知らんけど\n",
		"segments": [
			{
				"segment": "知",
				"index": 0,
				"input": "知らんけど\n",
				"isWordLike": true
			},
			{
				"segment": "らん",
				"index": 1,
				"input": "知らんけど\n",
				"isWordLike": true
			},
			{
				"segment": "けど",
				"index": 3,
				"input": "知らんけど\n",
				"isWordLike": true
			}			
		]
}
  return (
    <Container maxWidth="lg">
      <div>Reader Page</div>
    </Container>
  )
}

export default Reader