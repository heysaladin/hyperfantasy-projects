'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ChefHat, ChevronDown, ChevronRight,
  GripVertical, MoreVertical, Pencil, Plus, Trash2, X, Check,
} from 'lucide-react'

type CookingItem = {
  id: string
  tag: string
  title: string
  desc: string
  image: string
  bg: string
  active: boolean
}

const EMPTY: Omit<CookingItem, 'id' | 'active'> = { tag: '', title: '', desc: '', image: '', bg: '#0e0a1e' }

export default function AdminCookingPanel() {
  const [items, setItems] = useState<CookingItem[]>([])
  const [open, setOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY)
  const dragIndex = useRef<number | null>(null)

  const fetchItems = () => {
    fetch('/api/cooking', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
  }

  useEffect(() => { fetchItems() }, [])

  useEffect(() => {
    if (!menuId) return
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-cooking-menu]')) setMenuId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuId])

  const toggleActive = async (item: CookingItem) => {
    const updated = { ...item, active: !item.active }
    setItems(prev => prev.map(i => i.id === item.id ? updated : i))
    await fetch('/api/cooking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  const addItem = async () => {
    if (!addForm.title.trim()) return
    const res = await fetch('/api/cooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, active: true }),
    })
    const newItem = await res.json()
    if (newItem?.id) setItems(prev => [...prev, newItem])
    else fetchItems()
    setAddForm(EMPTY)
    setAddOpen(false)
  }

  const saveEdit = async () => {
    if (!editId || !editForm.title.trim()) return
    const updated = { ...items.find(i => i.id === editId)!, ...editForm }
    setItems(prev => prev.map(i => i.id === editId ? updated : i))
    setEditId(null)
    await fetch('/api/cooking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setMenuId(null)
    await fetch('/api/cooking', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const saveOrder = (ordered: CookingItem[]) => {
    fetch('/api/cooking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: ordered }),
    })
  }

  const onDragStart = (index: number) => { dragIndex.current = index }
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...items]
    const [item] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, item)
    dragIndex.current = index
    setItems(next)
  }
  const onDragEnd = () => { saveOrder(items); dragIndex.current = null }

  const activeCount = items.filter(i => i.active).length

  return (
    <div className="border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition text-left"
      >
        <div className="flex items-center gap-2">
          <ChefHat size={16} className="text-slate-500 dark:text-white/40" aria-hidden="true" />
          <span className="font-semibold">Cooking</span>
          <span className="text-xs text-slate-500 dark:text-white/40">— On Cooking section on homepage</span>
          {items.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60">
              {activeCount}/{items.length}
            </span>
          )}
        </div>
        {open
          ? <ChevronDown size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
          : <ChevronRight size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />}
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {/* Add form toggle */}
          {addOpen ? (
            <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4 space-y-2 bg-slate-50 dark:bg-white/3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">New Card</p>
              {[
                { key: 'title', label: 'Title', placeholder: 'Photography + AI Platform' },
                { key: 'tag', label: 'Tag', placeholder: 'Photography · AI' },
                { key: 'desc', label: 'Description', placeholder: 'Short description…' },
                { key: 'image', label: 'Image URL', placeholder: 'https://…' },
                { key: 'bg', label: 'BG Color', placeholder: '#0e0a1e' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-500 dark:text-white/40 mb-0.5">{label}</label>
                  <input
                    value={addForm[key as keyof typeof addForm]}
                    onChange={e => setAddForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-300 dark:placeholder:text-white/20"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm rounded-lg hover:opacity-80 transition"
                >
                  <Check size={13} /> Save
                </button>
                <button
                  onClick={() => { setAddOpen(false); setAddForm(EMPTY) }}
                  className="px-3 py-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 dark:border-white/15 rounded-lg text-sm text-slate-500 dark:text-white/40 hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-700 dark:hover:text-white transition w-full"
            >
              <Plus size={13} /> Add card
            </button>
          )}

          {/* Items list */}
          {items.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-white/40 text-center py-2">No cards yet. Add one above.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id}>
                  {editId === item.id ? (
                    /* ── Edit mode ── */
                    <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4 space-y-2 bg-slate-50 dark:bg-white/3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Edit Card</p>
                      {[
                        { key: 'title', label: 'Title' },
                        { key: 'tag', label: 'Tag' },
                        { key: 'desc', label: 'Description' },
                        { key: 'image', label: 'Image URL' },
                        { key: 'bg', label: 'BG Color' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs text-slate-500 dark:text-white/40 mb-0.5">{label}</label>
                          <input
                            value={editForm[key as keyof typeof editForm]}
                            onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null) }}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm rounded-lg hover:opacity-80 transition"
                        >
                          <Check size={13} /> Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 py-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Row mode ── */
                    <div
                      draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={e => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg"
                    >
                      <GripVertical size={15} className="text-slate-300 dark:text-white/20 cursor-grab active:cursor-grabbing flex-shrink-0" aria-hidden="true" />

                      {/* Thumbnail */}
                      {item.image ? (
                        <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0 relative" style={{ background: item.bg }}>
                          <Image src={item.image} alt={item.title} fill className="object-cover opacity-80" sizes="48px" />
                        </div>
                      ) : (
                        <div className="w-12 h-8 rounded flex-shrink-0" style={{ background: item.bg }} />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-white/80 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 dark:text-white/30 truncate">{item.tag}</p>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => toggleActive(item)}
                        className={`flex-shrink-0 px-2.5 py-1 text-xs rounded-full font-medium transition ${
                          item.active
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </button>

                      {/* 3-dot menu */}
                      <div className="relative flex-shrink-0" data-cooking-menu>
                        <button
                          data-cooking-menu
                          onClick={() => setMenuId(menuId === item.id ? null : item.id)}
                          className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
                          aria-label={`Options for ${item.title}`}
                        >
                          <MoreVertical size={14} aria-hidden="true" />
                        </button>
                        {menuId === item.id && (
                          <div
                            data-cooking-menu
                            className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-20"
                          >
                            <button
                              data-cooking-menu
                              onClick={() => { setEditId(item.id); setEditForm({ tag: item.tag, title: item.title, desc: item.desc, image: item.image, bg: item.bg }); setMenuId(null) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                            >
                              <Pencil size={12} aria-hidden="true" /> Edit
                            </button>
                            <button
                              data-cooking-menu
                              onClick={() => deleteItem(item.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                            >
                              <Trash2 size={12} aria-hidden="true" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
