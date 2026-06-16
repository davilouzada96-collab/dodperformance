/**
 * DOD Performance - Clinico Gate Worker
 * Cloudflare Worker para autenticação e gestão de acesso ao portão clínico
 * Com integração Resend API e validação de ID do paciente
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Route handling
  if (url.pathname === '/api/submit' && request.method === 'POST') {
    return handleSubmit(request, corsHeaders)
  }
  
  if (url.pathname === '/api/verify' && request.method === 'POST') {
    return handleVerify(request, corsHeaders)
  }
  
  // Default response
  return new Response('Clinico Gate API - DOD Performance', { 
    headers: { 
      ...corsHeaders,
      'Content-Type': 'text/plain' 
    } 
  })
}

/**
 * Handle submission form data
 */
async function handleSubmit(request, corsHeaders) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.patientId || !data.portal) {
      return new Response(JSON.stringify({ 
        error: 'Campos obrigatórios ausentes' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Validate patient ID format (example: simple numeric check)
    const patientIdRegex = /^\d{6,12}$/
    if (!patientIdRegex.test(data.patientId)) {
      return new Response(JSON.stringify({ 
        error: 'ID do paciente inválido. Use apenas números (6-12 dígitos)' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Generate access token (simple hash for demo - use stronger crypto in production)
    const accessToken = await generateToken(data.patientId, data.portal)
    
    // Send email notification via Resend
    const emailSent = await sendAccessEmail(data, accessToken)
    
    if (!emailSent) {
      return new Response(JSON.stringify({ 
        error: 'Erro ao enviar notificação. Tente novamente.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Return success with token
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Acesso autorizado. Verifique seu email para prosseguir.',
      token: accessToken,
      portal: data.portal,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Erro ao processar solicitação: ' + error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Verify access token
 */
async function handleVerify(request, corsHeaders) {
  try {
    const data = await request.json()
    
    if (!data.token) {
      return new Response(JSON.stringify({ 
        error: 'Token não fornecido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Verify token signature
    const isValid = await verifyToken(data.token)
    
    if (!isValid) {
      return new Response(JSON.stringify({ 
        error: 'Token inválido ou expirado' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({ 
      valid: true,
      message: 'Token válido'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Erro na verificação: ' + error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Generate access token
 */
async function generateToken(patientId, portal) {
  const timestamp = Date.now()
  const data = `${patientId}:${portal}:${timestamp}`
  
  // Get signing secret from environment
  const secret = SIGNING_SECRET || 'default-secret-change-in-production'
  
  // Create signature (simple HMAC-like approach)
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Encode token
  return btoa(`${data}:${signature}`)
}

/**
 * Verify token signature and expiration
 */
async function verifyToken(token) {
  try {
    const decoded = atob(token)
    const parts = decoded.split(':')
    
    if (parts.length !== 4) return false
    
    const [patientId, portal, timestamp, signature] = parts
    
    // Check expiration (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 24 * 60 * 60 * 1000) return false
    
    // Verify signature
    const secret = SIGNING_SECRET || 'default-secret-change-in-production'
    const data = `${patientId}:${portal}:${timestamp}`
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data + secret)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return signature === expectedSignature
    
  } catch (error) {
    return false
  }
}

/**
 * Send access email via Resend API
 */
async function sendAccessEmail(data, token) {
  const RESEND_API_KEY = typeof RESEND_API_KEY !== 'undefined' ? RESEND_API_KEY : null
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY não configurado')
    return false
  }
  
  const portalNames = {
    'pronto-socorro': 'Pronto-Socorro',
    'clinico': 'Clínico',
    'atls': 'ATLS',
    '--gate': 'Gate Principal',
    '--pro': 'Profissional',
    '--warn': 'Aviso'
  }
  
  const portalName = portalNames[data.portal] || data.portal
  
  const emailBody = {
    from: 'DOD Performance <noreply@dodperformance.com>',
    to: ['acesso@dodperformance.com'], // Configure destination email
    subject: `Novo acesso ao portão clínico - ${portalName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #667eea;">DOD Performance - Acesso Autorizado</h1>
        <p>Um novo acesso foi solicitado ao portão clínico:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">ID do Paciente:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.patientId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Portal:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${portalName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Timestamp:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString('pt-BR')}</td>
          </tr>
        </table>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <strong>Token de Acesso:</strong><br/>
          <code style="word-break: break-all; font-size: 12px;">${token}</code>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          Esta é uma notificação automática do sistema DOD Performance.<br/>
          Para questões de segurança, não responda este email.
        </p>
      </div>
    `
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Resend API error:', errorData)
      return false
    }
    
    return true
    
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// Export for testing
export { handleRequest, generateToken, verifyToken }
