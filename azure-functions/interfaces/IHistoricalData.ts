interface IHistoricalData {
    current: number;
    dayAgo: number | null;
    weekAgo: number | null;
    monthAgo: number | null;
    oldestRecord: number | null;
}

export default IHistoricalData;
