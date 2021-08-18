import { useState, useEffect } from "react"
import spacetime from "spacetime"

export default function useTick() {
  const [date, setDate] = useState(spacetime.now())

  useEffect(() => {
    const clockInterval = setInterval(() => setDate(spacetime.now()), 1000)
    return () => {
      // component unmount
      clearInterval(clockInterval)
    }
  }, [])

  return date // date object returned
}