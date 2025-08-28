import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

// import Sidebar from '../components/Sidebar'

function Home() {
  const navigate = useNavigate()

  // get access_token from localStorage
  let access_token = localStorage.getItem('access_token')

  let [decoded, setDecoded] = useState(null)
  let [profile, setProfile] = useState(null)
  let [loading, setLoading] = useState(null)
  let [error, setError] = useState(null)

  useEffect(() => {
    if (access_token) {
      try {
        setDecoded(jwtDecode(access_token))
      } catch {
        setDecoded(null)
      }
    } else {
      setDecoded(null)
    }
  }, [access_token])

  useEffect(() => {
    if (!access_token) return
    setLoading(true)
    const fetchProfile = async () => {
      try {
        const res = await axios({
          url: `http://localhost:3000/api/profile/me`,
          headers: { access_token }
        })

        setProfile(res.data.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile')
        setLoading(false)
      }
    }

    //fetch profile
    fetchProfile()
  }, [access_token])

  if (!access_token) {
    navigate('/')
  }

  const MyProfile = ({ decoded }) => {
    if (!decoded) return null
    return (
      <div className='flex gap-4'>
        <div><strong>User ID: </strong> <p>{decoded.id}</p>  </div>
        <div><strong>Email: </strong><p>{decoded.email}</p>  </div>
        <div><strong>Role: </strong><p>{decoded.role}</p>  </div>
        <div><strong>Profile ID: </strong><p>{decoded.profileId}</p>  </div>
      </div>
    )
  }

  return (
    <main>
      <h1>Welcome back {profile?.username}</h1>
      {
        decoded ? <MyProfile decoded={decoded} /> : <p>No access_token. Please login</p>
      }
      <hr />
      <h2>User Profile</h2>
      {loading && <p>Loading profile...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {
        profile && (
          <div>
            <img className='mx-auto' src={profile.imageUrl} alt={profile.username} />
            <p><strong>Fullname: </strong>{profile.fullname}</p>
            <p><strong>Username: </strong>{profile.username}</p>
            <p><strong>Date of Birth: </strong>{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          </div>
        )
      }
      <Link to='update' className='inline-block mt-4 cursor-pointer bg-sky-600 text-zinc-200 px-3 py-1'>
        Update Profile
      </Link>
    </main>
  )
}

export default Home