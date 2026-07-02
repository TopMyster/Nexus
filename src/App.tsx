import { useEffect, useState } from 'react'
import AISearch from './AISearch'
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack, IoIosSettings } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react"

export default function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isQuestion, setIsQuestion] = useState(false)
  const [isSettings, setIsSettings] = useState(false)
  const API_KEY = localStorage.getItem("api_key")

  useEffect(() => {
    const path = window.location.pathname
    if (path && path !== "/") {
      const urlQuery = decodeURIComponent(path.slice(1)).trim()

      if (urlQuery) {
        setSearchQuery(urlQuery)
        search(urlQuery)
      }
    }
  }, [])

  async function search(query: string) {
    if (!query || !query.trim()) return

    try {
       const hasProtocol = /^https?:\/\//i.test(query.trim())
       const testedURL = new URL(hasProtocol ? query.trim() : `https://${query.trim()}`)

       if (testedURL.hostname.split("."). length > 1) {
        window.open(testedURL, "_self")
        return
       }
    } catch(e) {
      console.error(e)
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

      - If it is an AI question = true
      - If it is a search term = false

      Example 1: "Why is the sky blue?" = true
      Example 2: "weather in Tokyo" = false
      Example 3: "How do I fix a leaky faucet?" = true      
      Example 4: "fast food near me" = false
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
    return result.includes("true")

    } catch(error) {
      console.error(error)
      return false
    }
  }

  return (
    isQuestion ? (
      <AnimatePresence>
        <motion.button whileHover={{ scale: 1.1, opacity: 1 }} whileTap={{ scale: 0.95, opacity: 0.5 }} className="back-btn" onClick={() => {setIsQuestion(false)}}><IoIosArrowBack size={25}/></motion.button>
        <AISearch query={searchQuery} api_key={API_KEY || ""}/>
      </AnimatePresence>
    ) : 
    <AnimatePresence>
      <motion.h1 key={"logo"} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='logo'>Nexus</motion.h1>
      <motion.div key={"search-box"}  className='search-box' initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <input key={"search-input"}  placeholder='Search anything...' value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} onKeyDown={(e) => {if (e.key === "Enter") {search(e.currentTarget.value)}}}/>
        <motion.button key={"Enter"}  initial={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.8, opacity: 0.8 }} onClick={() => {search(searchQuery)}}>
          <div key={"btn-txt"}  style={{ display: 'flex', flexDirection: "row", gap: 3 }}>
            <IoSearch size={15}/>Search
          </div>
        </motion.button>
      </motion.div>
            {!API_KEY ? <motion.h5 initial={{ scale: 1, opacity: 1 }} exit={{ opacity: 0, scale: 0.2 }} style={{ opacity: 0.6 }}>Please enter settings to configure your API KEY</motion.h5> : null}
      <motion.button key={"settings-btn"} className='settings-button' initial={{ scale: 1, opacity: 0.5 }} whileTap={{ scale: 0.8, opacity: 0 }} onClick={() => {setIsSettings(!isSettings)}}>
        <div key={"settingsbtn-div"}  style={{ display: 'flex', flexDirection: "row", gap: 2 }}>
          <IoIosSettings size={14}/>Settings
        </div>
      </motion.button>
      {isSettings && (
        <motion.div key={"settings"}  className='settings' initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
          <div>
            <h3 key={"or-header"}  style={{ margin: "0px 5px 0px" }}>OpenRouter</h3>
            <h5 key={"or-smalltxt"}  style={{ margin: "10px 0px 25px", opacity: 0.5 }}>Please type in your API Key</h5>
          </div>
          <input key={"or-input"}  placeholder='Type in your API Key' onChange={(e) => {localStorage.setItem("api_key", e.target.value)}}/>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
