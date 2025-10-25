import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { hubspotApiKey } = await request.json()
    
    if (!hubspotApiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    console.log('🔄 Starting full HubSpot migration...')

    const headers = {
      'Authorization': `Bearer ${hubspotApiKey}`,
      'Content-Type': 'application/json',
    }

    // 1. Fetch Companies -> Partners
    const companiesResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/companies?limit=100&properties=name,domain,phone,industry,city,state',
      { headers }
    )
    const companiesData = await companiesResponse.json()
    
    // 2. Fetch Deals
    const dealsResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,closedate,description,pipeline',
      { headers }
    )
    const dealsData = await dealsResponse.json()
    
    // 3. Fetch Contacts -> Leads
    const contactsResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,company,jobtitle',
      { headers }
    )
    const contactsData = await contactsResponse.json()

    // Map data to your schema
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
      description: deal.properties?.description || null,
    }))

    const leads = (contactsData.results || []).map((contact: any) => ({
      company: contact.properties?.company || 'Unknown Company',
      contact: `${contact.properties?.firstname || ''} ${contact.properties?.lastname || ''}`.trim() || 'Unknown',
      email: contact.properties?.email || '',
      phone: contact.properties?.phone || '',
      value: 0,
      assigned_to: null,
      status: 'New',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
      notes: contact.properties?.jobtitle || null,
    }))

    console.log(`Found: ${partners.length} partners, ${deals.length} deals, ${leads.length} leads`)

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

    const results = {
      partners: 0,
      deals: 0,
      leads: 0,
      errors: [] as string[]
    }

    // Insert Partners
    if (partners.length > 0) {
      const { data, error } = await supabase.from('partners').insert(partners).select()
      if (error) {
        results.errors.push(`Partners: ${error.message}`)
      } else {
        results.partners = data?.length || 0
      }
    }

    // Insert Deals
    if (deals.length > 0) {
      const { data, error } = await supabase.from('deals').insert(deals).select()
      if (error) {
        results.errors.push(`Deals: ${error.message}`)
      } else {
        results.deals = data?.length || 0
      }
    }

    // Insert Leads
    if (leads.length > 0) {
      const { data, error } = await supabase.from('leads').insert(leads).select()
      if (error) {
        results.errors.push(`Leads: ${error.message}`)
      } else {
        results.leads = data?.length || 0
      }
    }

    console.log('✅ Migration complete:', results)

    return NextResponse.json({ 
      success: true,
      imported: {
        partners: results.partners,
        deals: results.deals,
        leads: results.leads,
        total: results.partners + results.deals + results.leads
      },
      errors: results.errors
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
    message: 'HubSpot Full Migration Endpoint',
    imports: 'Companies (Partners), Deals, Contacts (Leads)',
    usage: 'POST with { hubspotApiKey: "your-key" }',
    status: 'ready' 
  })
}
