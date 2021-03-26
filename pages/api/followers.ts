import type { NextApiRequest, NextApiResponse } from 'next'
import { getFollowers } from '../../lib/devto'
import IFollower from '../../interfaces/IFollower'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'GET') {
        res.status(405)
        return
    }

    const latestFollowers: IFollower[] = await getFollowers()
    res.status(200).json(latestFollowers)
}
