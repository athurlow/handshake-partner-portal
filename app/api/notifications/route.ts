import { NextResponse } from 'next/server';
import type { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    text: 'New deal registered by TechCorp Solutions',
    time: '2 hours ago',
    read: false,
    type: 'deal',
  },
  {
    id: '2',
    text: 'Lead assigned to Global Systems Inc',
    time: '4 hours ago',
    read: false,
    type: 'lead',
  },
  {
    id: '3',
    text: 'Innovation Partners approved for Silver tier',
    time: '1 day ago',
    read: true,
    type: 'partner',
  },
  {
    id: '4',
    text: 'Digital Dynamics completed onboarding',
    time: '2 days ago',
    read: true,
    type: 'partner',
  },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return NextResponse.json(mockNotifications);
}

export async function PUT(request: Request) {
  const { id } = await request.json();
  
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
  
  return NextResponse.json(notification);
}