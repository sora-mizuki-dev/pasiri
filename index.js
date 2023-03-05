const decoder = new TextDecoder()

const messageHistories = []

async function request(text) {
  const message = {
    role: 'user',
    content: text,
  }

  const body = JSON.stringify({
    messages: [
      ...messageHistories,
      message
    ],
    model: 'gpt-3.5-turbo',
  })

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_SECRET_KEY')}`,
    },
    body
  })

  messageHistories.push(message)

  const data = await res.json()

  return data.choices[0].message.content.trim()
}

async function main() {
  console.log(`Pasiri: Hello! May I help you?\n`)
  for await (const chunk of Deno.stdin.readable) {
    const text = decoder.decode(chunk);

    try {
      const answer = await request(text);
      console.log(`\nPasiri: ${answer}\n`)
    } catch (e) {
      console.error(e)
    }
  }
}

main()
