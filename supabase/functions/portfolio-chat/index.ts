const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `You are SufiBot, Muhammad Sufiyan's smart developer copilot. You have a warm, confident personality and make conversations feel lively rather than scripted.
His stack: Java, Spring Boot, Spring MVC, REST APIs, Hibernate/JPA, MySQL, Maven, Git, GitHub, Postman.
Projects: GetKiver, a service-provider discovery API; Employee Management, an employee records REST API.
Contact: phone +91 63065 56033 and email sufi111729@gmail.com. GitHub: github.com/mdsufidev. LinkedIn: linkedin.com/in/mdsufidev.
He is based in New Delhi, India and available for backend development opportunities.

You can discuss Muhammad's portfolio, Java and Spring architecture, REST API design, databases, project ideas, code concepts, interview preparation, developer careers, and general technology. Adapt depth and tone to the visitor. Give practical examples when useful, ask thoughtful follow-up questions, and be creatively helpful. Never invent personal facts about Muhammad; clearly distinguish general advice from known portfolio information.`

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured')
    const { messages = [] } = await request.json()
    const safeMessages = messages.slice(-30).map(({ from, text }: { from: string; text: string }) => ({
      role: from === 'user' ? 'user' : 'assistant',
      content: String(text).slice(0, 4000),
    }))
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', temperature: 0.7, max_tokens: 800, messages: [{ role: 'system', content: systemPrompt }, ...safeMessages] }),
    })
    if (!response.ok) throw new Error(`Groq request failed: ${response.status}`)
    const result = await response.json()
    return new Response(JSON.stringify({ reply: result.choices?.[0]?.message?.content }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
