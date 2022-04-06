import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word } = req.query
  console.log()
  const response = fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`).catch(error => console.log(error))
  const json = await (await response).json()
  res.json(json)
}