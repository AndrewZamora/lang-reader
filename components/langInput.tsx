import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

const toFurigana = async (text: String) => {
  const kuroshiro = new Kuroshiro()
  await kuroshiro.init(new KuromojiAnalyzer({
    // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
    dictPath: '/static/dict/',
  }))
  const furigana = await kuroshiro.convert(text, { mode: "furigana", to: "hiragana" }).catch(err => console.log(err))
  return furigana
}

const LangInput = () => {
  useEffect(() => {
  })
  
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    setOutput(await toFurigana(input))
    setInput('')
    setIsLoading(false)
  }

  return (
    <div className={styles.container}>
      {isLoading && 'loading...'}
      <div dangerouslySetInnerHTML={{ __html: output }}></div>
      <input type="text" onInput={input => setInput(input.target.value)} />
      <button onClick={async () => handleSubmit()}>click</button>
    </div >
  )
}

export default LangInput
