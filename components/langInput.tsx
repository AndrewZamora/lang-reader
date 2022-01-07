import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import React, { useState, useEffect } from 'react';
import styles from '../styles/langInput.module.css'

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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    if (input) {
      setIsLoading(true)
      setOutput(await toFurigana(input))
      setInput('')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={event => handleSubmit(event)}>
        <input type="text" value={input} onChange={event => handleInput(event)} />
        <button type="submit">click</button>
        {isLoading && 'loading...'}
        <div dangerouslySetInnerHTML={{ __html: output }}></div>
      </form>
    </div >
  )
}

export default LangInput
