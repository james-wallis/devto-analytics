import type { NextApiRequest, NextApiResponse } from 'next'
import IAzureHistoricalData from '../../../../common/interfaces/IAzureHistoricalData'
import { getAzureHistoricalData } from '../../../lib/azure'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'GET') {
        res.status(405).send('Only GET allowed')
        return
    }
    const azureHistoricalData: IAzureHistoricalData = await getAzureHistoricalData()
    res.status(200).json(azureHistoricalData)
}
