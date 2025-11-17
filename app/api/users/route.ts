import { NextResponse } from 'next/server';

let users = [
  { id: 1, name: 'Tran Van Toan', email: 'toan@gmail.com' },
  { id: 2, name: 'Le Xuan Duc', email: 'duc@gmail.com' },
  { id: 3, name: 'Ly Hai', email: 'hai@gmail.com' },
  { id: 4, name: 'Bui Thi Xuan', email: 'xuan@gmail.com' },
  { id: 5, name: 'Dam Hai Ha', email: 'ha@gmail.com' },
  { id: 6, name: 'Vu Cong Hau', email: 'hau@gmail.com' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search')?.trim() || '';
  const perPage = 5;
  const filtered = search
    ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    : users;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  return NextResponse.json({ users: paginated, total: filtered.length });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newUser = { id: Date.now(), ...body };
  users.push(newUser);
  return NextResponse.json(newUser);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  users = users.filter((u) => u.id != id);
  return NextResponse.json({ success: true });
}
