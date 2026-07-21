import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const FILE = path.join(process.cwd(), 'data', 'cooking.json')

type CookingItem = {
  id: string
  tag: string
  title: string
  desc: string
  image: string
  bg: string
  active: boolean
}

function read(): CookingItem[] {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) } catch { return [] }
}

function write(items: CookingItem[]) {
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2))
}

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const items = read()
  const item: CookingItem = {
    id: crypto.randomUUID(),
    tag: body.tag?.trim() ?? '',
    title: body.title.trim(),
    desc: body.desc?.trim() ?? '',
    image: body.image?.trim() ?? '',
    bg: body.bg?.trim() ?? '#0e0a1e',
    active: body.active ?? true,
  }
  items.push(item)
  write(items)
  return NextResponse.json(item)
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const items = read()
  const idx = items.findIndex(i => i.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  items[idx] = { ...items[idx], ...body }
  write(items)
  return NextResponse.json(items[idx])
}

export async function PATCH(req: Request) {
  const { items } = await req.json()
  if (!Array.isArray(items)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  write(items)
  return NextResponse.json(items)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const items = read().filter(i => i.id !== id)
  write(items)
  return NextResponse.json({ ok: true })
}
