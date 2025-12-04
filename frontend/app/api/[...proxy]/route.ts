export async function GET(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const path = params.proxy.join('/');

  try{
    // Get query string from request
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;

    console.log('[PROXY GET]', fullUrl);

    // Prepare headers with optional Vercel bypass token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Vercel bypass token if available
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypassSecret) {
      headers['x-vercel-protection-bypass'] = bypassSecret;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });
    
    console.log('[PROXY RESPONSE] Status:', response.status);
    
    const text = await response.text();
    console.log('[PROXY RESPONSE] Body length:', text.length);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[PROXY JSON ERROR]', e, 'Body:', text.substring(0, 500));
      return new Response(text, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, type: 'proxy_error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const path = params.proxy.join('/');

  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;

    const body = await request.text();

    console.log('[PROXY POST]', fullUrl);

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypassSecret) {
      headers['x-vercel-protection-bypass'] = bypassSecret;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: body,
    });
    
    console.log('[PROXY RESPONSE] Status:', response.status);
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[PROXY JSON ERROR]', e);
      return new Response(text, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, type: 'proxy_error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const path = params.proxy.join('/');

  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;

    const body = await request.text();

    console.log('[PROXY PUT]', fullUrl);

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypassSecret) {
      headers['x-vercel-protection-bypass'] = bypassSecret;
    }

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: body,
    });
    
    console.log('[PROXY RESPONSE] Status:', response.status);
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[PROXY JSON ERROR]', e);
      return new Response(text, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, type: 'proxy_error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const path = params.proxy.join('/');

  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;

    console.log('[PROXY DELETE]', fullUrl);

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypassSecret) {
      headers['x-vercel-protection-bypass'] = bypassSecret;
    }

    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
    
    console.log('[PROXY RESPONSE] Status:', response.status);
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[PROXY JSON ERROR]', e);
      return new Response(text, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, type: 'proxy_error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
