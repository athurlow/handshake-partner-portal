import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from('profiles').select('count')
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: error.message 
      })
    }
    
    return NextResponse.json({ 
      status: 'connected',
      message: 'Supabase is working!' 
    })
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'failed',
      message: err.message 
    })
  }
}
