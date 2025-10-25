import { NextResponse } from 'next/server'

interface Notification {
  id: number
  text: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    text: 'New deal registered by TechCorp Solutions',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    text: 'Lead assigned to Global Systems Inc',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 3,
    text: 'Innovation Partners approved for Silver tier',
    time: '1 day ago',
    read: true,
  },
]

export async function GET() {
  return NextResponse.json(mockNotifications)
}
