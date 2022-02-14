// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AnkiExport from 'anki-apkg-export'

type Data = {
  name: string
}

const exportAnkiDeck = async (flashCards, deckName) => {
  const apkg = new AnkiExport(deckName)
  console.log("apkg", apkg)
  flashCards.forEach((card) => {
    const {
      segment: front,
      hiragana: back,
    } = card
    apkg.addCard(front, back)
  });
  const zip = await apkg
    .save()
    .catch((err) => console.log(err.stack || err))
  return zip
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { deckName, flashCards } = req.body
  console.log({flashCards, deckName})
  const file = await exportAnkiDeck(flashCards, deckName)
  // res.writeHead(200, {
  //   "Content-Type": "application/octet-stream",
  //   "Content-Disposition": "attachment; filename=" + 'test.apkg'
  // }).send(file)
  res.send(file)
}
