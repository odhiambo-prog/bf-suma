/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'

export default async function handler(
  req: any,
  res: any,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, context } = req.body
  if (!messages || !context) {
    return res.status(400).json({ error: 'Missing messages or context' })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const systemPrompt = buildSystemPrompt(context)

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 600,
      stream: true,
    })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) res.write(content)
    }
    res.end()
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    if (error?.status === 401) {
      res.status(500).json({ error: 'AI service not configured' })
    } else {
      res.status(500).json({ error: 'AI service unavailable' })
    }
  }
}

function buildSystemPrompt(context: any): string {
  const { businessInfo, lead, products, branches, events, faqs } = context

  const sections: string[] = [
    `You are a helpful AI assistant for BF SUMA Eagle Shop, a health and wellness store in Nairobi, Kenya.`,
    ``,
    `BUSINESS INFO:`,
    `- Name: ${businessInfo?.name || 'BF SUMA Eagle Shop'}`,
    `- Address: ${businessInfo?.address || '6th Floor, Utumishi House, Mamlaka Road, Nairobi'}`,
    `- Phone: ${businessInfo?.phone || '+254 (0)716626037'}`,
    `- Email: ${businessInfo?.email || 'info@eagleshop.co.ke'}`,
    `- Website: https://eagleshop.co.ke`,
    ``,
    `CUSTOMER: ${lead?.name || 'A visitor'}${lead?.location ? ` from ${lead.location}` : ''}`,
    ``,
    `BRANCHES:`,
  ]

  const branchList = (branches || []).map((b: any) =>
    `- ${b.name}${b.address ? `: ${b.address}` : ''}${b.phone ? ` (${b.phone})` : ''}`
  )
  sections.push(branchList.length ? branchList.join('\n') : '- No branches listed.')
  sections.push(``)
  sections.push(`PRODUCTS AND STOCK:`)

  const productList = (products || []).map((p: any) => {
    const stockStr = (p.stock || []).map((s: any) =>
      `${s.branchName}: ${s.quantity} in stock${s.inStock ? '' : ' (out of stock)'}`
    ).join('; ')
    return `- ${p.code}: ${p.name} (${p.category})${stockStr ? ` — ${stockStr}` : ''}`
  })
  sections.push(productList.length ? productList.join('\n') : '- No products listed.')
  sections.push(``)
  sections.push(`EVENTS:`)

  const eventList = (events || []).map((e: any) =>
    `- ${e.title}: ${e.event_date}${e.location_name ? ` at ${e.location_name}` : ''}${e.status ? ` [${e.status}]` : ''}${e.description ? ` — ${e.description.substring(0, 100)}` : ''}`
  )
  sections.push(eventList.length ? eventList.join('\n') : '- No events listed.')
  sections.push(``)
  sections.push(`FAQ:`)

  const faqList = (faqs || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)
  sections.push(faqList.length ? faqList.join('\n\n') : '- No FAQs available.')
  sections.push(``)
  sections.push(`DISTRIBUTOR PROGRAM: ${businessInfo?.distributorProgram?.name || 'Eagle Distributor Program'}. ${businessInfo?.distributorProgram?.ctaLabel || 'Become a Distributor'}: ${businessInfo?.distributorProgram?.ctaLink || 'https://register.bfsuma.com'}`)
  sections.push(``)
  sections.push(`INSTRUCTIONS:`)
  sections.push(`- Be concise, friendly, and helpful. Use emojis sparingly.`)
  sections.push(`- Answer ONLY based on the data provided above.`)
  sections.push(`- If you don't know something or it's not in the data, say "I don't have that information. Would you like to speak with a human?"`)
  sections.push(`- When the customer wants to order or speak to a human, direct them to click the "Talk to human" button.`)
  sections.push(`- Address the customer by name when possible.`)
  sections.push(`- When asked about product availability, check the stock levels per branch and tell them which branches have stock.`)
  sections.push(`- Keep responses under 3-4 sentences when possible.`)

  return sections.join('\n')
}
