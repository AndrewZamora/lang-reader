// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AnkiExport from 'anki-apkg-export'

type Data = {
  name: string
}

const exportAnkiDeck = async (flashcards) => {
  let deckName = "testDeck"
  const apkg = new AnkiExport(deckName)
  console.log("apkg", apkg)
  flashcards.forEach((card) => {
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
  // saveAs(zip, `${deckName}.apkg`)
  console.log("done")
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const file = await exportAnkiDeck([{ segment: 'test', hiragana: 'てすと' }])
  // res.writeHead(200, {
  //   "Content-Type": "application/octet-stream",
  //   "Content-Disposition": "attachment; filename=" + 'test.apkg'
  // }).send(file)
  res.send(file)
}
