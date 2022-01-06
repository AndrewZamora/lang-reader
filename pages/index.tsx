import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import LangInput from '../components/langInput'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <LangInput></LangInput>
    </div>
  )
}

export default Home
