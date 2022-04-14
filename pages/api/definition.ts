import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word } = req.query
  const response = fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`).catch(error => console.log(error))
  const result = await response
  try {
    const json = await result.json()
    res.json(json)
  } catch (error) {
    console.log({error})
  }
}