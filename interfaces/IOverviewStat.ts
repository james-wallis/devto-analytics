interface IOverviewStat {
    name: string;
    value: number;
    otherStats?: {
        value: string;
        desc: string;
        larger?: boolean;
    }[];
    daily?: number;
    weekly?: number;
    monthly?: number;
}

export default IOverviewStat;
