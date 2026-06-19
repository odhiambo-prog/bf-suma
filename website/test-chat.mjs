import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('❌ Set OPENAI_API_KEY first:  export OPENAI_API_KEY=sk-...')
  process.exit(1)
}

const openai = new OpenAI({ apiKey })

const systemPrompt = `You are a helpful AI assistant for BF SUMA Eagle Shop, a health and wellness store in Nairobi, Kenya.

BUSINESS INFO:
- Name: BF SUMA Eagle Shop
- Address: 6th Floor, Utumishi House, Mamlaka Road, Nairobi
- Phone: +254 (0)716626037
- Email: info@eagleshop.co.ke
- Website: https://eagleshop.co.ke

CUSTOMER: John from Nairobi

PRODUCTS AND STOCK:
- AP013C: Pure & Broken Ganoderma Spores (Immune Boosters) — Eagle Shop - Utumishi: 24 in stock

UPCOMING EVENTS:
- Wellness Screening Day: 2026-07-15 at Eagle Wellness Center [upcoming]

BRANCHES:
- Eagle Shop - Utumishi: 6th Floor, Utumishi House, Mamlaka Road, Nairobi
- Eagle Shop - Naivasha: Moi Avenue, Naivasha Town

RULES:
- Be concise and friendly. Use emojis sparingly.
- Answer only from the data above.`

const testMessages = [
  { role: 'user', content: 'Hi, is Pure & Broken Ganoderma Spores in stock?' },
]

console.log('\n🤖 Testing AI chat integration...\n')
console.log('System prompt:', systemPrompt.substring(0, 100) + '...\n')

try {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...testMessages,
    ],
    temperature: 0.7,
    max_tokens: 600,
    stream: true,
  })

  let full = ''
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      full += content
      process.stdout.write(content)
    }
  }

  console.log('\n\n✅ Response complete!')
  console.log(`\nToken count: ~${full.split(' ').length} words\n`)
} catch (err) {
  console.error('\n❌ OpenAI API error:', err.message)
  process.exit(1)
}
