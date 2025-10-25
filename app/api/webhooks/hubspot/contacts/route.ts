import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    console.log('🔔 HubSpot Contact Webhook received!')
    
    const body = await request.json()
    console.log('Webhook data:', JSON.stringify(body, null, 2))

    const contactData = body[0]
    
    if (!contactData) {
      return NextResponse.json({ error: 'No contact data' }, { status: 400 })
    }

    const partner = {
      name: contactData.properties?.company || contactData.properties?.name || 'Unknown Company',
      tier: contactData.properties?.partner_tier || 'Bronze',
      contact: contactData.properties?.email || contactData.properties?.contact_email,
      phone: contactData.properties?.phone || contactData.properties?.contact_phone,
      status: 'Active',
      revenue: 0,
      deals: 0,
      growth: 0,
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
      .from('partners')
      .insert([partner])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('✅ Partner saved to Handshake:', data)

    return NextResponse.json({ 
      success: true, 
      message: 'Partner synced from HubSpot',
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
    message: 'HubSpot Contact Webhook Endpoint',
    status: 'ready' 
  })
}
