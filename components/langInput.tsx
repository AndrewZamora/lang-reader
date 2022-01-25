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
    // const newKuroshiro = new Kuroshiro()
    // await newKuroshiro.init(new KuromojiAnalyzer({
    //   // https://github.com/hexenq/kuroshiro/issues/38#issuecomment-441419030
    //   dictPath: DICT_PATH,
    // }))
    // const newTokenizer = await initTokenizer()
    // setTokenizer(newTokenizer)
    // setKuroshiro(newKuroshiro)
    const newSegmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });
    setSegmenterJa(newSegmenterJa)
  }, []);

  useEffect(() => {
    if(segmenterJa) return
    setUp()
  })

  // const [tokenizer, setTokenizer] = useState<object | null>(null)
  const [kuroshiro, setKuroshiro] = useState<object | null>(null)
  const [segmenterJa, setSegmenterJa] = useState<object | null>(null)
  const [tokens, setTokens] = useState([])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const convertTo = async (mode: String, text: String) => {
    // if (kuroshiro) {
    //   const furigana = await kuroshiro.convert(text, { mode }).catch(err => console.log(err))
    //   return furigana
    // }
    if(segmenterJa) {
      const segments = segmenterJa.segment(text)
      console.table(Array.from(segments));
      console.log(segmenterJa,segments)
      const handleClick = (segment) => {
        console.log(segment, 'test')
      }
      const htmlString = Array.from(segments).map((segment, index) =>{
        if(segment.segment && segment.isWordLike) {
          return <span key={segment.segment} onMouseOver={console.log(segment.segment)} onClick={()=>handleClick(segment.segment)} className={styles.segment}>{segment.segment}</span>
        }
        return segment.segment
      })
      return htmlString
    }
    return [<span></span>]
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
      const newOutput = await convertTo("okurigana", input)
      setOutput(newOutput)
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
        {output && output.map(item => item)}
      </form>
    </div >
  )
}

export default LangInput
