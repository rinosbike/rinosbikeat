export async function GET(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    // Get query string from request
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;
    
    console.log('[PROXY GET]', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;
    
    const body = await request.text();
    
    console.log('[PROXY POST]', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;
    
    const body = await request.text();
    
    console.log('[PROXY PUT]', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${backendUrl}/api/${path}${queryString}`;
    
    console.log('[PROXY DELETE]', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
