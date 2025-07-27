import { useState } from 'react'
import { Button, Card, Space } from 'tdesign-react'
import './App.less'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>Vite + React + TDesign</h1>
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Space direction="vertical" align="center">
          <Button 
            theme="primary" 
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </Space>
      </Card>
    </div>
  )
}

export default App
