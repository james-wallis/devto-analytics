import IStat from './IStat'

interface IOverviewStats {
    title: string
    subtitle?: string
    headlineValue: number
    stats: IStat[]
}

export default IOverviewStats
