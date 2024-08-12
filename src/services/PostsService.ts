import camelcaseKeys from 'camelcase-keys';
import { z } from 'zod'

const CategorySchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).transform((val) => camelcaseKeys(val, { deep: true }));

const PostSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  content: z.string(),
  summary: z.string(),
  author: z.string(),
  slug: z.string(),
  category: CategorySchema,
  thumb: z.string(),
  views: z.number(),
  status: z.enum(['draft', 'ready']),
  created_at: z.string().transform((val) => new Date(val)),
  updated_at: z.string().transform((val) => new Date(val)),
}).transform((val) => camelcaseKeys(val, { deep: true }));
export type Post = z.infer<typeof PostSchema>;

const ApiResponse = z.array(PostSchema);

export class PostService {
    private static apiCache = new Map<string, Post>()
    private static ENDPOINT = 'https://cms.2077.xyz/api/articles'

    public static async getPosts(): Promise<Post[]> {
        const res = await fetch(PostService.ENDPOINT)
        const json = await res.json()
        const data = ApiResponse.parse(json)

        PostService.populateCache(data)

        return data
    }

    public static async getPostBySlug(slug: string): Promise<Post> {
        if(PostService.apiCache.has(slug)){
            return PostService.apiCache.get(slug)!
        }

        await PostService.getPosts()

        return PostService.getPostBySlug(slug)
    }

    private static populateCache(posts: Post[]){
        PostService.apiCache.clear()

        posts.forEach(post => {
            PostService.apiCache.set(post.slug, post)
        })
    }
}
