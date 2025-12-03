// src/App.js
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// 🎯 步骤 1: 导入 SubmissionForm 组件
import SubmissionForm from './components/SubmissionForm'; // 确保路径正确

function App() {
  const [count, setCount] = useState(0);

  return (
    // 🎯 步骤 2: 在这里渲染您的组件
    <div className="App">
      
      {/* 渲染 SubmissionForm 组件 */}
      <SubmissionForm /> 
      
      {/* 保持或删除 Vite+React 的默认内容，例如： */}
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  );
}

export default App;