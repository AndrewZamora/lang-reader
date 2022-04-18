import type { NextApiRequest, NextApiResponse } from 'next'
const { createWorker } = require('tesseract.js')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const file = req.body
  console.log({file})
  const worker = createWorker()
  await worker.load()
  await worker.loadLanguage('jpn')
  await worker.initialize('jpn')
  const { data: { text } } = await worker.recognize(file)
  console.log(text)
  await worker.terminate()
    res.json({"text": text})
}