import ITreasureItem from './ITreasureItem';

interface IFoundTreasureItem {
  id: string,
  time: Date,
  item?: ITreasureItem,
  answer?: string
}

export default IFoundTreasureItem;
