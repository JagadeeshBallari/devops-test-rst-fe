import fetch from 'node-fetch';
export async function POST(req:any, res:any) {
  const adaptedBody = await req.json();
  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${adaptedBody.email}:${adaptedBody.password}`).toString('base64'),
      },
      body: JSON.stringify({email: adaptedBody.email, password: adaptedBody.password, firstName: adaptedBody.firstName, lastName: adaptedBody.lastName}),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Authentication successful:', data);
      
      return new Response(JSON.stringify({ message: 'Login successful', data }), { status: 200 });
    } else {
      console.error('Authentication failed');
      return new Response(JSON.stringify({ message: 'Login failed' }), { status: 401 });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return new Response(JSON.stringify({ message: 'Login failed' }), { status: 500 });
  }
 
}