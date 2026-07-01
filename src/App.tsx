import { useState } from 'react'
import AISearch from './AISearch'

export default function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isQuestion, setIsQuestion] = useState(false)
  const API_KEY = "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"

  async function search(query: string) {
    if (query.includes(".") || query.includes("https://")) {
      const formattedQuery = !query.startsWith("https://") ? `https://${query}` : query
      window.open(new URL(formattedQuery), "_self")
      return
    } 

    const isAIQuestion = await checkQuestion(query)

    setSearchQuery(query)
    setIsQuestion(isAIQuestion)

    if (!isAIQuestion) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_self")
    }
  }

  async function checkQuestion(query: string) {
    const prompt = 
    `
      You are a routing assistant for a search engine. Your job is to analyze the user's query and determine if it is a question meant for an AI, or a simple search term/keyword.

      Analyze the following query: "${query}"

      Respond strictly with only the word "true" or the word "false". Do not include any other text, JSON, markdown formatting, or explanations.

      - If it is an AI question -> true
      - If it is a search term -> false

      Example 1: "Why is the sky blue?" -> true
      Example 2: "weather in Tokyo" -> false
      Example 3: "How do I fix a leaky faucet?" -> true      
      Example 4: "fast food near me" -> false
    `
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-4-31b-it',
          messages: [
            {
              role: 'user',
              content: prompt
            },
          ],
        }),
      })

    const data = await response.json()
    const result = data.choices[0].message.content.toLowerCase()
    console.log(result)
    return result.includes("true")

    } catch(error) {
      console.error(error)
      return false
    }
  }

  return (
    isQuestion ? (
      <AISearch query={searchQuery} api_key={API_KEY}/>
    ) : 
    <>
      <h1 className='logo'>Nexus</h1>
      <div className='search-box'>
        <input placeholder='Search a query' value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} onKeyDown={(e) => e.key === "Enter" && search(searchQuery)}/>
        <button onClick={() => {search(searchQuery)}}>Search</button>
      </div>
    </>
  )
}
