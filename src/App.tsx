import { useRoutes } from 'react-router-dom'
import { Router } from '@/routers/index.tsx'
import Header from '@/views/layout/header/index'
function App() {
  return (
    <>
    <Header></Header> 
    <Router></Router>
    </>
  )
 
}

export default App
