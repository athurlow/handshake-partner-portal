import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { hubspotApiKey } = await request.json()
    
    if (!hubspotApiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    console.log('🔄 Syncing from HubSpot...')

    const headers = {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json',
    }

    // Fetch latest data from HubSpot
    const [companiesResponse, dealsResponse, contactsResponse] = await Promise.all([
      fetch('https://api.hubapi.com/crm/v3/objects/companies?limit=50&properties=name,domain,phone', { headers }),
      fetch('https://api.hubapi.com/crm/v3/objects/deals?limit=50&properties=dealname,amount,dealstage,closedate', { headers }),
      fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=50&properties=firstname,lastname,email,phone,company', { headers })
    ])

    const [companiesData, dealsData, contactsData] = await Promise.all([
      companiesResponse.json(),
      dealsResponse.json(),
      contactsResponse.json()
    ])

    // Map to your schema
    const partners = (companiesData.results || []).map((company: any) => ({
      name: company.properties?.name || 'Unknown Company',
      tier: 'Bronze',
      contact: company.properties?.domain || '',
      phone: company.properties?.phone || '',
      status: 'Active',
      revenue: 0,
      deals: 0,
      growth: 0,
    }))

    const deals = (dealsData.results || []).map((deal: any) => ({
      name: deal.properties?.dealname || 'Untitled Deal',
      company: 'Unknown',
      value: parseFloat(deal.properties?.amount || '0'),
      status: deal.properties?.dealstage === 'closedwon' ? 'Approved' : 
              deal.properties?.dealstage === 'closedlost' ? 'Rejected' : 'Pending',
      partner: null,
      date: deal.properties?.closedate || new Date().toISOString().split('T')[0],
    }))

    const leads = (contactsData.results || []).map((contact: any) => ({
      company: contact.properties?.company || 'Unknown Company',
      contact: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim() || 'Unknown',
      email: contact.properties?.email || '',
      phone: contact.properties?.phone || '',
      value: 0,
      status: 'New',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
    }))

    // Use Service Role to upsert data
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const results = {
      partners: 0,
      deals: 0,
      leads: 0,
      errors: [] as string[]
    }

    // Upsert (insert or update) data
    if (partners.length > 0) {
      const { data, error } = await supabase.from('partners').upsert(partners, { onConflict: 'name' }).select()
      if (error) {
        results.errors.push(`Partners: ${error.message}`)
      } else {
        results.partners = data?.length || 0
      }
    }

    if (deals.length > 0) {
      const { data, error } = await supabase.from('deals').upsert(deals, { onConflict: 'name' }).select()
      if (error) {
        results.errors.push(`Deals: ${error.message}`)
      } else {
        results.deals = data?.length || 0
      }
    }

    if (leads.length > 0) {
      const { data, error } = await supabase.from('leads').upsert(leads, { onConflict: 'email' }).select()
      if (error) {
        results.errors.push(`Leads: ${error.message}`)
      } else {
        results.leads = data?.length || 0
      }
    }

    console.log('✅ Sync complete:', results)

    return NextResponse.json({ 
      success: true,
      synced: {
        partners: results.partners,
        deals: results.deals,
        leads: results.leads,
        total: results.partners + results.deals + results.leads
      },
      errors: results.errors
    })

  } catch (error: any) {
    console.error('❌ Sync error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
