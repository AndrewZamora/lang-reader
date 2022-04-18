import type { NextApiRequest, NextApiResponse } from 'next'
const { createWorker } = require('tesseract.js')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('jpn');
  await worker.initialize('jpn');
  const { data: { text } } = await worker.recognize('https://learnjapanesedaily.com/wp-content/uploads/2.2.2-1.jpg')
  console.log(text)
  await worker.terminate()
    res.json({"text": text})
}