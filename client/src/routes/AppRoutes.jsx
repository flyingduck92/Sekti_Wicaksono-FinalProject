import { Routes, Route } from 'react-router-dom'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import AuthTabs from '../pages/AuthTabs'
import Home from '../pages/Home'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<AuthTabs />} />
      <Route path='/about' element={<About />} />
      <Route path='/*' element={<NotFound />} />
      <Route path='/auth/home' element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
