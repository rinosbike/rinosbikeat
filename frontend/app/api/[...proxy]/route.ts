export async function GET(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Backend error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const body = await request.text();
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Backend error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const body = await request.text();
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Backend error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  try {
    const response = await fetch(`${backendUrl}/api/${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Backend error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
