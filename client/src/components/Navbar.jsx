import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='flex gap-8'>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}

export default Navbar