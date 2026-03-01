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

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = useState([])
  const [filteredPortfolios, setFilteredPortfolios] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const itemsPerPage = 6

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    const res = await fetch('/api/portfolios')
    const data = await res.json()
    setPortfolios(data)
    setFilteredPortfolios(data)
  }

  // Search filter
  useEffect(() => {
    const filtered = portfolios.filter((p: any) => 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredPortfolios(filtered)
    setCurrentPage(1)
  }, [search, portfolios])

  // Pagination
  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredPortfolios.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = async () => {
    if (!deleteId) return
    
    await fetch(`/api/portfolios/${deleteId}`, { method: 'DELETE' })
    await fetchPortfolios()
    setDeleteId(null)
  }

  return (
    <div className="p-8 bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolios</h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mt-1">
            Total: {filteredPortfolios.length} portfolios
          </p>
        </div>
        <Link href="/admin/portfolios/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Add New
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={20} />
        <Input
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
        />
      </div>

      {/* Table */}
      <div className="border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-300 dark:border-white/10">
            <tr>
              <th className="text-left p-4 font-semibold">Title</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Complexity</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((portfolio: any) => (
              <tr key={portfolio.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{portfolio.title}</div>
                    <div className="text-sm text-slate-600 dark:text-white/60 line-clamp-1">
                      {portfolio.description}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-white/60 capitalize">{portfolio.category || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${
                    portfolio.complexity === 'short'
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                  }`}>
                    {portfolio.complexity || '-'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    portfolio.isVisible 
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {portfolio.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/portfolios/${portfolio.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDeleteId(portfolio.id)}
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
          <div className="p-8 text-center text-white/40">
            No portfolios found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this portfolio
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