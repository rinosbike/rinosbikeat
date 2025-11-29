export async function GET(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  const response = await fetch(`${backendUrl}/api/${path}`, {
    headers: request.headers,
  });
  return response;
}

export async function POST(request: Request, { params }: { params: { proxy: string[] } }) {
  const backendUrl = 'https://rinosbikeat-git-main-rinosbikes-projects.vercel.app';
  const path = params.proxy.join('/');
  
  const response = await fetch(`${backendUrl}/api/${path}`, {
    method: 'POST',
    headers: request.headers,
    body: await request.text(),
  });
  return response;
}
