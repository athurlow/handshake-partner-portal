// Create app/api/hubspot/route.ts
export async function GET() {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    }
  });
  const data = await response.json();
  return Response.json(data);
}