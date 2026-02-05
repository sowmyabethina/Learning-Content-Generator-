import fetch from 'node-fetch';

async function test() {
  console.log('Testing /generate-from-pdf...\n');
  try {
    const res = await fetch('http://localhost:5000/generate-from-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ github_url: 'https://github.com/sowmyabethina/mcp/blob/main/sample.pdf' })
    });
    console.log('Response Status:', res.status);
    const text = await res.text();
    console.log('Response Body:', text);
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Could not parse JSON:', e.message);
    }
  } catch (e) {
    console.error('Request Error:', e.message, e.code);
  }
}

test();
