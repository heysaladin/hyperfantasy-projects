import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

async function getBlogs() {
  return await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function ArticlesPage() {
  const blogs = await getBlogs()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Articles</h1>
          <p className="text-xl text-white/60">
            Thoughts on design, development, and everything in between
          </p>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {blogs.map((blog: any) => (
            <Link 
              key={blog.id}
              href={`/articles/${blog.slug}`}
              className="block group"
            >
              <article className="flex flex-col md:flex-row gap-8">
                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="md:w-1/3 aspect-video overflow-hidden rounded-lg bg-white/5">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full group-hover:scale-105 transition"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <time className="text-sm text-white/40">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  
                  <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-white/60 transition">
                    {blog.title}
                  </h2>
                  
                  <p className="text-white/60 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/10 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}