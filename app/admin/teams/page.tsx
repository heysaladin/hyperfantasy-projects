'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Member = { id: string; name: string; bio?: string | null; avatarUrl?: string | null; orderIndex?: number | null }

const emptyForm = { name: '', bio: '', avatarUrl: '', orderIndex: 0 }

export default function TeamsPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = async () => {
    setLoading(true)
    const res = await fetch('/api/teams')
    const data = await res.json()
    setMembers(Array.isArray(data) ? data : (data.items ?? []))
    setLoading(false)
  }

  useEffect(() => { fetchMembers() }, [])

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowAdd(true); setError(null) }
  const openEdit = (m: Member) => { setForm({ name: m.name, bio: m.bio ?? '', avatarUrl: m.avatarUrl ?? '', orderIndex: m.orderIndex ?? 0 }); setEditingId(m.id); setShowAdd(true); setError(null) }
  const cancelForm = () => { setShowAdd(false); setEditingId(null); setError(null) }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    try {
      const payload = { name: form.name.trim(), bio: form.bio || null, avatarUrl: form.avatarUrl || null, orderIndex: Number(form.orderIndex) || 0 }
      const res = editingId
        ? await fetch(`/api/teams/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to save') }
      await fetchMembers()
      cancelForm()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/teams/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    await fetchMembers()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Teams</h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mt-0.5">Total: {members.length} members</p>
        </div>
        {!showAdd && (
          <Button size="sm" onClick={openAdd}>
            <Plus size={16} />
            <span className="ml-1.5">Add Member</span>
          </Button>
        )}
      </div>

      {/* Inline form */}
      {showAdd && (
        <div className="mb-6 border border-slate-200 dark:border-white/10 rounded-xl p-5 space-y-4 bg-slate-50 dark:bg-white/[0.02]">
          <h2 className="font-semibold text-sm">{editingId ? 'Edit Member' : 'New Member'}</h2>
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="m-name">Name *</Label>
              <Input id="m-name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="bg-white dark:bg-white/5" placeholder="Full name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="m-bio">Role / Bio</Label>
              <Input id="m-bio" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} className="bg-white dark:bg-white/5" placeholder="e.g. Creative Director" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="m-avatar">Avatar URL</Label>
              <Input id="m-avatar" type="url" value={form.avatarUrl} onChange={e => setForm(f => ({...f, avatarUrl: e.target.value}))} className="bg-white dark:bg-white/5" placeholder="https://..." />
              {form.avatarUrl && (
                <div className="mt-1 flex items-center gap-2">
                  <img src={form.avatarUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                  <span className="text-xs text-slate-400 dark:text-white/30">Preview</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="m-order">Order Index</Label>
              <Input id="m-order" type="number" value={form.orderIndex} onChange={e => setForm(f => ({...f, orderIndex: parseInt(e.target.value) || 0}))} className="bg-white dark:bg-white/5 w-24" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Check size={14} className="mr-1" />
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Member'}
            </Button>
            <Button size="sm" variant="outline" onClick={cancelForm}>
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="py-16 text-center border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 dark:text-white/30 text-sm">
          No team members found. Add one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/5 transition">
              {m.avatarUrl ? (
                <Image src={m.avatarUrl} alt={m.name} width={48} height={48} className="rounded-full object-cover shrink-0 w-12 h-12" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/40 font-semibold text-sm shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug">{m.name}</p>
                {m.bio && <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{m.bio}</p>}
              </div>
              {m.orderIndex !== null && m.orderIndex !== undefined && (
                <span className="text-xs text-slate-400 dark:text-white/30 shrink-0">#{m.orderIndex}</span>
              )}
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(m)} aria-label="Edit">
                  <Pencil size={14} aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => setDeleteId(m.id)} aria-label="Delete">
                  <Trash2 size={14} aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
