import type { NextApiRequest, NextApiResponse } from 'next'
import { getArticles } from '../../lib/devto'
import IArticle from '../../interfaces/IArticle'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method !== 'GET') {
        res.status(405)
        return
    }

    const latestArticles: IArticle[] = await getArticles()
    res.status(200).json(latestArticles)
}
