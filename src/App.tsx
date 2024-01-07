import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from './features'
import { RouteItem } from './types'
import { ReturnPage, SignOutPage, TablePage } from './pages'

function App() {
  const routes:RouteItem[] = [
    { path: 'table', label: 'Test Items Database'},
    { path: 'sign-out', label: 'Sign Out Form'},
    { path: 'return', label: 'Return Form'},
  ]
  return (
    <BrowserRouter>
      <NavBar routes={routes}/>
      <Routes>
        <Route path='/' element={<Navigate to='/table' />} />
        <Route path='/table' Component={TablePage}/>
        <Route path='/sign-out' Component={SignOutPage}/>
        <Route path='/return' Component={ReturnPage}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
