import { jwtDecode } from 'jwt-decode'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import AuthTabs from '../pages/AuthTabs'
import MainLayout from '../components/MainLayout'
import Home from '../pages/Home'
import ToolList from '../pages/ToolList'
import UserList from '../pages/UserList'
import ProfileList from '../pages/ProfileList'

import CategoryList from '../pages/CategoryList'
import CategoryEdit from '../pages/CategoryEdit'

import MyProfile from '../pages/MyProfile'
import MyEmail from '../pages/MyEmail'
import MyPassword from '../pages/MyPassword'

function RequireAuth({allowedRoles}) {
  let role = null
  let access_token = localStorage.getItem('access_token')
  if(access_token) {
    try {
      const payload = jwtDecode(access_token)
      role = payload.role
    } catch {
      role = null
    }
  }
  if (!access_token) return <Navigate to="/" replace />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/auth/home" replace />
  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<AuthTabs />} />
      <Route path='/*' element={<NotFound />} />

      {/* Staff/Admin after successfully Login */}
      <Route element={<MainLayout />}>
        <Route path='/about' element={<About />} />
        <Route path='/auth/home' element={<Home />} />
        <Route path='/auth/home/update' element={<MyProfile />} />
        <Route path='/auth/myemail' element={<MyEmail />} />
        <Route path='/auth/mypassword' element={<MyPassword />} />

        <Route path='/auth/tool' element={<ToolList />} />

        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path='/auth/user' element={<UserList />} />
          <Route path='/auth/profiles' element={<ProfileList />} />
        </Route>

        <Route path='/auth/categories' element={<CategoryList />} />
        <Route path={`/auth/categories/edit/:id`} element={<CategoryEdit />} />
      </Route>

    </Routes>
  )
}

export default AppRoutes