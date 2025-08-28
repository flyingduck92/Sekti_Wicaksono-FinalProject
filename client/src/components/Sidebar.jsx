import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function Sidebar() {
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

  return (
    <nav className="mt-8 size-4 w-[20%] rounded-4xl">
      <div className="flex flex-col border bg-sky-900 p-2">
        <Link to="/auth/home"
          className="bg-sky-500 hover:bg-sky-200  w-full p-1"
        >
          Home
        </Link>
        <Link to="/auth/myemail"
          className="bg-sky-500 hover:bg-sky-200  w-full p-1"
        >
          Update Email
        </Link>
        <Link to="/auth/mypassword"
          className="bg-sky-500 hover:bg-sky-200  w-full p-1"
        >
          Change Password
        </Link>
        <Link to="/auth/tool"
          className="bg-sky-500 hover:bg-sky-200  w-full p-1"
        >
          Tool List
        </Link>
        {
          role === 'admin' && (
            <>
              <Link to="/auth/user" className="bg-sky-500 hover:bg-sky-200  w-full p-1">
                User List
              </Link>
              <Link to="/auth/profiles" className="bg-sky-500 hover:bg-sky-200  w-full p-1">
                Profile List
              </Link>
            </>
          )
        }
        <Link to="/auth/categories"
          className="bg-sky-500 hover:bg-sky-200  w-full p-1"
        >
          Category
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar