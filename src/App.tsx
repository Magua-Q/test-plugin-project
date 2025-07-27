import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DynamicComponentLoader from './DynamicComponentLoader'

function App() {
  const [count, setCount] = useState(0)
  const [pluginId, setPluginId] = useState('default')

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React - Dynamic Plugin Loading</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="card">
        <h2>Dynamic Plugin Loader Demo</h2>
        <div style={{ marginBottom: '20px' }}>
          <label>Select Plugin: </label>
          <select 
            value={pluginId} 
            onChange={(e) => setPluginId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="default">Default Plugin</option>
            <option value="custom">Custom Plugin</option>
            <option value="notfound">Non-existent Plugin</option>
          </select>
        </div>
        <DynamicComponentLoader key={pluginId} pluginId={pluginId} />
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

