import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('access_token'))

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(!!localStorage.getItem('access_token'))
    }, 10000)
    return () => clearInterval(interval)
  }, [])


  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className='flex gap-8'>
      <Link to={loggedIn ? 'auth/home' : '/'}>
        {loggedIn ? 'Home' : 'Register/Login'}
      </Link>
      {
        !loggedIn && <Link to="/about">About</Link>
      }
      {loggedIn && (
        <button onClick={() => handleLogout()}
          className="cursor-pointer bg-rose-500 py-2 px-6 font-bold text-white">
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navbar