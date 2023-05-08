
import Deck from './Deck'
export default interface Reader {
  name: string,
  input: string,
  lang: string,
  segments: Deck[],
  id: string,
  source?: string,
}