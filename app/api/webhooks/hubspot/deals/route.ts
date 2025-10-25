import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    console.log('🔔 HubSpot Deal Webhook received!')
    
    const body = await request.json()
    console.log('Webhook data:', JSON.stringify(body, null, 2))

    const dealData = body[0]
    
    if (!dealData) {
      return NextResponse.json({ error: 'No deal data' }, { status: 400 })
    }

    const deal = {
      name: dealData.properties?.dealname || 'Untitled Deal',
      company: dealData.properties?.company_name || dealData.properties?.company || 'Unknown',
      value: parseFloat(dealData.properties?.amount || '0'),
      status: dealData.properties?.dealstage === 'closedwon' ? 'Approved' : 'Pending',
      partner: dealData.properties?.partner_name || null,
      date: new Date().toISOString().split('T')[0],
      description: dealData.properties?.description || null,
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data, error } = await supabase
      .from('deals')
      .insert([deal])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('✅ Deal saved to Handshake:', data)

    return NextResponse.json({ 
      success: true, 
      message: 'Deal synced from HubSpot',
      data 
    })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'HubSpot Deal Webhook Endpoint',
    status: 'ready' 
  })
}
