interface IOverviewStat {
    name: string;
    value: number;
    otherStats?: {
        value: string;
        desc: string;
    }[];
    daily?: number;
    weekly?: number;
    monthly?: number;
}

export default IOverviewStat;
