import type { NextApiRequest, NextApiResponse } from 'next'
import IAzureData from '../../../../common/interfaces/IAzureData'
import { getAzureData } from '../../../lib/azure'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'GET') {
        res.status(405).send('Only GET allowed')
        return
    }
    const azureData: IAzureData = await getAzureData()
    res.status(200).json(azureData)
}
