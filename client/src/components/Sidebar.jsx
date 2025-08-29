import { NavLink } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function Sidebar() {
  let role = null
  let access_token = localStorage.getItem('access_token')
  if (access_token) {
    try {
      const payload = jwtDecode(access_token)
      role = payload.role
    } catch {
      role = null
    }
  }

  const linkClass = ({ isActive }) =>
    `bg-sky-500 hover:bg-sky-500/20 hover:text-amber-200 w-full p-1 ${isActive ? 'font-bold text-yellow-200' : ''
    }`

  return (
    <nav className="mt-8 size-4 w-[20%] rounded-4xl">
      <div className="flex flex-col border bg-sky-900 p-2">
        <NavLink to="/auth/home" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/auth/myemail" className={linkClass}>
          Update Email
        </NavLink>
        <NavLink to="/auth/mypassword" className={linkClass}>
          Change Password
        </NavLink>
        <NavLink to="/auth/tool" className={linkClass}>
          Tool List
        </NavLink>
        {
          role === 'admin' && (
            <>
              <NavLink to="/auth/user" className={linkClass}>
                User List
              </NavLink>
              <NavLink to="/auth/profiles" className={linkClass}>
                Profile List
              </NavLink>
            </>
          )
        }
        <NavLink to="/auth/categories" className={linkClass}>
          Category
        </NavLink>
      </div>
    </nav>
  )
}

export default Sidebar