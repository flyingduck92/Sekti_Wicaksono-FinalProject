import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import { useActionState } from 'react'
import { hasMinLength, isNotEmpty } from '../utils/validation'

function ProfileEdit() {

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
      <div className='flex gap-4 justify-between'>
        <div><strong>User ID: </strong> <p>{decoded.id}</p>  </div>
        <div><strong>Email: </strong><p>{decoded.email}</p>  </div>
        <div><strong>Role: </strong><p>{decoded.role}</p>  </div>
        <div><strong>Profile ID: </strong><p>{decoded.profileId}</p>  </div>
      </div>
    )
  }

  // fetch current ID
  const { id } = useParams()
  const [singleProfile, setSingleProfile] = useState(null)

  useEffect(() => {
    if (!access_token) return
    const fetchProfile = async () => {
      try {
        const res = await axios({
          url: `http://localhost:3000/api/profile/${id}`,
          headers: { access_token }
        })
        console.log('Fetched Data:', res.data.data)
        setSingleProfile(res.data.data) // adjust if your backend returns differently
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile')
      }
    }
    fetchProfile()
  }, [access_token, id])

  // Profile Form Update
  async function profileUpdateAction(prevFormState, formData) {
    const username = formData.get('username')
    const fullname = formData.get('fullname')
    const dateOfBirth = formData.get('dateOfBirth')
    const imageUrl = formData.get('imageUrl')
    const role = formData.get('role')

    const errors = []

    if (!isNotEmpty(username) || !hasMinLength(username, 6)) {
      errors.push('Username required and must have 6 characters minimum')
    }
    if (!isNotEmpty(fullname) || !hasMinLength(fullname, 6)) {
      errors.push('Please input fullname and must have 6 characters minimum')
    }
    if (!isNotEmpty(dateOfBirth)) {
      errors.push('Please input fullname')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        enteredValue: { username, fullname, dateOfBirth, imageUrl, role }
      }
    }

    let dataEntered = { username, fullname, dateOfBirth, imageUrl, role }
    // console.log(id)
    try {
      // if okay send to backend
      // /api/profile/update/c808c20b-9a3d-4af6-a704-fe9d0f57f1aa
      // and set error to null
      const update = await axios({
        url: `http://localhost:3000/api/profile/update/${id}`,
        method: 'PUT',
        data: dataEntered,
        headers: { access_token }
      })

      if (update && update.data && update.data.message) {
        return {
          errors: null,
          success: update.data?.message || 'Profile updated successfully!',
          enteredValue: { username, fullname, dateOfBirth, imageUrl, role }
        }
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to update'
        ],
        enteredValue: { username, fullname, dateOfBirth, imageUrl, role }
      }
    }
  }

  const [formState, formAction] = useActionState(profileUpdateAction, { error: null })

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

        (profile && singleProfile) && (
          <div className='mt-4'>
            <h2 className='my-2 text-2xl font-bold'>Edit Profile</h2>
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="email">Email</label>
                <p><strong>{singleProfile?.User.email}</strong></p>
              </div>
              <div>
                <label className='block' htmlFor="username">Username</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="username" id="username"
                  placeholder='e.g: jonthor666'
                  defaultValue={formState.enteredValue?.username ? formState.enteredValue?.username : singleProfile?.username} />
              </div>
              <div>
                <label className='block' htmlFor="fullname">Full name</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="fullname" id="fullname"
                  placeholder='e.g: Jon Thor'
                  defaultValue={formState.enteredValue?.fullname ? formState.enteredValue?.fullname : singleProfile?.fullname} />
              </div>
              <div>
                <label className='block' htmlFor="dateOfBirth">Date of Birth</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="date" name="dateOfBirth" id="dateOfBirth"
                  defaultValue={formState.enteredValue?.dateOfBirth
                    ? formState.enteredValue?.dateOfBirth
                    : (typeof singleProfile?.dateOfBirth === 'string'
                      ? singleProfile?.dateOfBirth.slice(0, 10)
                      : '')}
                />
              </div>
              <div>
                <label className='block' htmlFor="imageUrl">Image URL</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="imageUrl" id="imageUrl"
                  placeholder='e.g: https://placehold.co/200'
                  defaultValue={formState.enteredValue?.imageUrl ? formState.enteredValue?.imageUrl : singleProfile?.imageUrl} />
                <p className='block text-sm font-bold'>Please input your image url here</p>
              </div>
              <div>
                <label className="block" >Role</label>
                <label htmlFor="staff">
                  <input
                    type="radio" name="role" value="staff" id="staff"
                    defaultChecked={formState.enteredValue?.role
                      ? formState.enteredValue?.role === 'staff'
                      : singleProfile?.role === 'staff'}
                  />
                  Staff
                </label>
                <label className="ml-4" htmlFor="admin">
                  <input
                    type="radio" name="role" value="admin" id="admin"
                    defaultChecked={formState.enteredValue?.role
                      ? formState.enteredValue?.role === 'admin'
                      : singleProfile?.role === 'admin'}
                  />
                  Admin
                </label>
              </div>

              {
                formState.errors &&
                <ul className='border text-white bg-rose-500 border-rose-500 container m-4 mb-0'>
                  {
                    formState.errors.map(error =>
                      <li key={error}>{error}</li>
                    )
                  }
                </ul>
              }

              {
                formState.success && (
                  <div className="border text-white bg-green-600 border-green-600 container m-4 mb-0 p-2">
                    {formState.success}
                  </div>
                )
              }

              <button className='mt-8 cursor-pointer bg-sky-600 text-zinc-200 px-3 py-1' type='submit'>
                Submit Update
              </button>
            </form>
          </div>
        )
      }
    </main>
  )
}

export default ProfileEdit