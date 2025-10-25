import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { hubspotApiKey } = await request.json()
    
    if (!hubspotApiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    console.log('🔄 Starting HubSpot migration...')

    // Fetch all deals from HubSpot
    const dealsResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,closedate,description,partner_name,company_name',
      {
        headers: {
          'Authorization': `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!dealsResponse.ok) {
      throw new Error(`HubSpot API error: ${dealsResponse.statusText}`)
    }

    const dealsData = await dealsResponse.json()
    
    if (!dealsData.results || dealsData.results.length === 0) {
      return NextResponse.json({ 
        success: true,
        imported: 0,
        message: 'No deals found in HubSpot'
      })
    }

    // Map HubSpot deals to your schema
    const deals = dealsData.results.map((deal: any) => ({
      name: deal.properties?.dealname || 'Untitled Deal',
      company: deal.properties?.company_name || 'Unknown Company',
      value: parseFloat(deal.properties?.amount || '0'),
      status: deal.properties?.dealstage === 'closedwon' ? 'Approved' : 
              deal.properties?.dealstage === 'closedlost' ? 'Rejected' : 'Pending',
      partner: deal.properties?.partner_name || null,
      date: deal.properties?.closedate || new Date().toISOString().split('T')[0],
      description: deal.properties?.description || null,
    }))

    console.log(`Found ${deals.length} deals to import`)

    // Save to Supabase
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
      .insert(deals)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log(`✅ Successfully imported ${data.length} deals`)

    return NextResponse.json({ 
      success: true,
      imported: data.length,
      deals: data
    })

  } catch (error: any) {
    console.error('❌ Migration error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'HubSpot Migration Endpoint',
    usage: 'POST with { hubspotApiKey: "your-key" }',
    status: 'ready' 
  })
}
