/**
 * Blog Grid Component
 * Displays featured blog posts in a grid layout
 * Based on rinosbike.eu featured-blog pattern
 */

import Link from 'next/link'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  imageUrl?: string
  slug: string
}

interface BlogGridProps {
  posts: BlogPost[]
  columns?: 2 | 3 | 4
  showViewAll?: boolean
  viewAllLink?: string
}

export default function BlogGrid({
  posts,
  columns = 3,
  showViewAll = true,
  viewAllLink = '/blog'
}: BlogGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }

  return (
    <>
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 md:gap-8`}>
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden bg-gray-200 mb-4">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Blog Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{post.date}</p>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {showViewAll && (
        <div className="text-center mt-10">
          <Link
            href={viewAllLink}
            className="inline-block bg-gray-900 text-white px-8 py-3 text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Alle Beiträge ansehen
          </Link>
        </div>
      )}
    </>
  )
}
