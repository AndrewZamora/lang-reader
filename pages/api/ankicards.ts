// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AnkiExport from 'anki-apkg-export'
import { saveAs } from 'file-saver'

type Data = {
  name: string
}
  const exportAnkiDeck = async (flashcards) => {
    let deckName = "testDeck"
    const apkg = new AnkiExport(deckName)
    console.log("apkg",apkg)
    // flashCards.forEach((card) => {
    //   const {
    //     segment: front,
    //     hiragana: back,
    //   } = card
    //   apkg.addCard(front, back)
    // });
    // const zip = await apkg
    //   .save()
    //   .catch((err) => console.log(err.stack || err))
    // saveAs(zip, `${deckName}.apkg`)
    // console.log("done")
  }


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'here is your deck' })
}
