import Kuroshiro from 'kuroshiro'
import Kuromoji from 'kuromoji'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/langInput.module.css'

const DICT_PATH = '/static/dict/'

const initTokenizer = (): Promise<object> => {
  return new Promise((resolve, reject) => {
    Kuromoji.builder({ dicPath: DICT_PATH }).build((error, tokenizer) => {
      if (error) return reject(error)
      resolve(tokenizer)
    })
  });
}


const LangInput = () => {
  const setUp = useCallback(async () => {
    const newKuroshiro = new Kuroshiro()
    await newKuroshiro.init(new KuromojiAnalyzer({
      // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
      dictPath: DICT_PATH,
    }))
    // const newTokenizer = await initTokenizer()
    // setTokenizer(newTokenizer)
    setKuroshiro(newKuroshiro)
  }, []);

  useEffect(() => {
    setUp()
  })

  // const [tokenizer, setTokenizer] = useState<object | null>(null)
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [tokens, setTokens] = useState([])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toFurigana = async (text: String) => {
    if (kuroshiro) {
      const furigana = await kuroshiro.convert(text, { mode: "furigana", to: "hiragana" }).catch(err => console.log(err))
      return furigana
    }
  }
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input) {
      setIsLoading(true)
      // if (tokenizer) {
      //   const tokens = await tokenizer.tokenize(input)
      //   console.log(tokens)
      //   setTokens(tokens)
      // }
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
        <div>{tokens.length > 0 && tokens.map(token => token.reading ? token.reading : '')}</div>
      </form>
    </div >
  )
}

export default LangInput
