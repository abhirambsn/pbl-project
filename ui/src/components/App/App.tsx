import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <h1>App</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c+1)}>+</button>
      <button onClick={() => setCount(c => c <= 0 ? 0 : c-1)}>-</button>
    </div>
    </>
  )
}

export default App
