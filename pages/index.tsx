import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import LangInput from '../components/langInput'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useCallback } from 'react';


const Home: NextPage = () => {
  const [userInput, setUserInput] = useState('')
  return (
    <div className={styles.container}>
      {userInput && `${userInput}`}
      <LangInput handleOutput={(output) => setUserInput(output)}></LangInput>
    </div>
  )
}

export default Home
