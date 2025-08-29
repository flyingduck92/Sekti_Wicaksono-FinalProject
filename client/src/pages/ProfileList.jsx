import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import axios from 'axios'
import { useRef } from 'react'

function ProfileList() {
  // if no access token go to /
  const navigate = useNavigate()
  let access_token = localStorage.getItem('access_token')
  useEffect(() => {
    if (!access_token) {
      navigate('/')
    }
  }, [access_token, navigate])

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

  const MyProfile = ({ decoded }) => {
    if (!decoded) return null
    return (
      <div className='flex gap-4 justify-between'>
        <div><strong>User ID: </strong> <p>{decoded.id}</p>  </div>
        <div><strong>Email: </strong><p>{decoded.email}</p>  </div>
        <div><strong>Role: </strong><p>{decoded.role}</p>  </div>
        <div><strong>Profile ID: </strong><p>{decoded.profileId}</p>  </div>
      </div>
    )
  }

  //fetch profiles
  const [profiles, setProfiles] = useState([])
  const [total, setTotal] = useState(0)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginateProfiles = profiles

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [profiles, totalPages, currentPage])

  const fetchProfiles = useRef(async (page = 1, pageSize = 10) => {
    try {
      const offset = (page - 1) * pageSize
      const res = await axios({
        url: `http://localhost:3000/api/profile?limit=${pageSize}&offset=${offset}`,
        method: 'GET',
        headers: { access_token }
      })
      // console.log(res.data?.data)
      setTotal(res.data?.data?.total)
      setProfiles(res.data?.data?.profiles || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Profiles failed to fetch')
    }
  })

  useEffect(() => {
    if (!access_token) {
      navigate('/')
    }
    fetchProfiles.current(currentPage, pageSize)
  }, [access_token, currentPage, pageSize, navigate])


  return (
    <main>
      <h1>My Profile</h1>
      {
        decoded ? <MyProfile decoded={decoded} /> : <p>No access_token. Please login</p>
      }
      <hr />
      {loading && <p>Loading profile...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {
        profile && (
          <div className='mt-2'>
            <h2 className='my-2 text-2xl font-bold'>Profile List</h2>
            {/* Add Notes to other Admin */}
            <small className='mt-2 text-sm font-bold'>Every new User will have empty profile details, please instruct the user to fill their Profile after Registration</small>
            <br />
            <small className='mt-2 text-sm font-bold'>Note: To remove a Profile, go to UserList and choose delete to remove the Profile related to the User</small>
            <p className='mt-4'>Total: {total}</p>
            {/* Table List */}
            <table className="mt-4 min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">No.</th>
                  <th className="border px-4 py-2">Profile ID</th>
                  <th className="border px-4 py-2">User ID</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  paginateProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">No categories found.</td>
                    </tr>
                  ) : (
                    paginateProfiles.map((c, index) => {
                      let numbering = (currentPage - 1) * pageSize + (index + 1)
                      return (
                        <tr key={c.id}>
                          <td className="border px-4 py-2">{numbering}</td>
                          <td className="border px-4 py-2">{c.id}</td>
                          <td className="border px-4 py-2">{c.User.id}</td>
                          <td className="border px-4 py-2">{c.username ? c.username : 'No Username'}</td>
                          <td className="border px-4 py-2">{c.User.email}</td>
                          <td className="border px-4 py-2">{c.role}</td>
                          <td className="border px-4 py-2">
                            {
                              (c.User.email !== decoded.email) &&
                              <>
                                <Link
                                  to={`/auth/profiles/edit/${c.id}`}
                                  className="cursor-pointer bg-blue-500 text-white px-2 py-1 mr-2 rounded inline-block"
                                >
                                  Edit
                                </Link>
                              </>
                            }
                          </td>
                        </tr>
                      )
                    })
                  )
                }
              </tbody>
            </table>

            {/* pagination control */}
            <div className="flex gap-2 mt-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages || profiles.length === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>

          </div>
        )
      }
    </main>
  )
}

export default ProfileList