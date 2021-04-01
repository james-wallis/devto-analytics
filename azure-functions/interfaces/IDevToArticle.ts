interface IDevToArticle {
    type_of: string
    id: number
    title: string
    description: string
    published: boolean
    published_at: string
    slug: string
    path: string
    url: string
    comments_count: number
    public_reactions_count: number
    page_views_count: number
    published_timestamp: string
    positive_reactions_count: number
    cover_image: string | null
    tag_list: string[]
    canonical_url: string
}

export default IDevToArticle;
