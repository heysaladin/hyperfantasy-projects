'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>()
  for (let i = 1; i <= 3; i++) pages.add(i)
  for (let i = total - 2; i <= total; i++) pages.add(i)
  if (current > 3 && current < total - 2) {
    pages.add(current - 1)
    pages.add(current)
    pages.add(current + 1)
  }
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: (number | '...')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const res = await fetch('/api/blogs')
    const data = await res.json()
    setBlogs(Array.isArray(data) ? data : [])
  }

  const filtered = blogs.filter((b: any) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.title?.toLowerCase().includes(q) ||
      b.excerpt?.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' })
    await fetchBlogs()
    setDeleteId(null)
    const newTotal = Math.max(1, Math.ceil((filtered.length - 1) / itemsPerPage))
    if (currentPage > newTotal) setCurrentPage(newTotal)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Blogs</h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mt-0.5">
            {search
              ? `${filtered.length} of ${blogs.length} blogs`
              : `Total: ${blogs.length} blogs`}
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button size="sm" className="sm:size-auto">
            <Plus size={16} />
            <span className="ml-1.5">Add New</span>
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={18} />
        <Input
          placeholder="Search by title or excerpt..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
        />
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-3 mb-5">
        {paginatedData.length === 0 ? (
          <div className="py-10 text-center text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/10 rounded-lg">
            {search ? 'No blogs match your search' : 'No blogs found'}
          </div>
        ) : paginatedData.map((blog: any) => (
          <div key={blog.id} className="border border-slate-200 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-white/[0.02]">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm leading-snug line-clamp-2">{blog.title}</div>
                {blog.excerpt && (
                  <div className="text-xs text-slate-500 dark:text-white/40 mt-0.5 line-clamp-1">{blog.excerpt}</div>
                )}
              </div>
              <span className={`shrink-0 px-2 py-0.5 text-xs rounded ${
                blog.isPublished
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
              }`}>
                {blog.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            {blog.slug && (
              <div className="text-xs text-slate-400 dark:text-white/30 mb-2 truncate">{blog.slug}</div>
            )}
            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Link href={`/admin/blogs/${blog.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil size={14} />
                  <span className="ml-1.5 text-xs">Edit</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(blog.id)}
                className="text-red-500 border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                <span className="ml-1.5 text-xs">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-300 dark:border-white/10">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Slug</th>
                <th className="text-left p-4 font-semibold">Tags</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((blog: any) => (
                <tr key={blog.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-medium">{blog.title}</div>
                    <div className="text-sm text-slate-600 dark:text-white/60 line-clamp-1">{blog.excerpt}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-white/60 text-sm">{blog.slug || '-'}</td>
                  <td className="p-4 text-slate-600 dark:text-white/60 text-sm">
                    {Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      blog.isPublished
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/blogs/${blog.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(blog.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedData.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-white/40">
              {search ? 'No blogs match your search' : 'No blogs found'}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-1 flex-wrap justify-center">
            {getPageNumbers(safePage, totalPages).map((page, i) =>
              page === '...' ? (
                <span key={`ellipsis-${i}`} className="flex items-center px-2 text-slate-400 dark:text-white/40">
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={safePage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-9"
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this blog
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
