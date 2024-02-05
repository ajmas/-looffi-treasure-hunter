import ITreasureItem from './ITreasureItem';

interface IFoundTreasureItem {
  id: string,
  time: Date,
  item?: ITreasureItem
}

export default IFoundTreasureItem;
