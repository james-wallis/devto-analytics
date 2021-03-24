import IStat from './IStat'

interface IOverviewStats {
    type: 'stat' | 'list'
    title: string
    subtitle?: string
    headlineValue: number
    stats: IStat[]
}

export default IOverviewStats
