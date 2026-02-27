'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState([])

  useEffect(() => {
    fetch('/api/portfolios')
      .then(res => res.json())
      .then(setPortfolios)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio?')) return
    
    await fetch(`/api/portfolios/${id}`, { method: 'DELETE' })
    setPortfolios(portfolios.filter((p: any) => p.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <Link href="/admin/portfolios/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Add New
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {portfolios.map((portfolio: any) => (
          <div key={portfolio.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{portfolio.title}</h3>
              <p className="text-sm text-white/60">{portfolio.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/portfolios/${portfolio.id}`}>
                <Button variant="outline" size="sm">
                  <Pencil size={16} />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(portfolio.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}