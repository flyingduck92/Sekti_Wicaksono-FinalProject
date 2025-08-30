import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { useActionState } from 'react'
import { hasMinLength, isNotEmpty } from '../utils/validation'

function MyProfile() {
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
      <div className='flex gap-4'>
        <div><strong>User ID: </strong> <p>{decoded.id}</p>  </div>
        <div><strong>Email: </strong><p>{decoded.email}</p>  </div>
        <div><strong>Role: </strong><p>{decoded.role}</p>  </div>
        <div><strong>Profile ID: </strong><p>{decoded.profileId}</p>  </div>
      </div>
    )
  }

  /* Form Update */
  async function myProfileUpdateAction(prevFormState, formData) {
    const username = formData.get('username')
    const fullname = formData.get('fullname')
    const dateOfBirth = formData.get('dateOfBirth')
    const imageUrl = formData.get('imageUrl')

    const errors = []

    if (!isNotEmpty(username) || !hasMinLength(username, 6)) {
      errors.push('Username required and must have 6 characters minimum')
    }
    if (!isNotEmpty(fullname) || !hasMinLength(fullname, 6)) {
      errors.push('Please input fullname and must have 6 characters minimum')
    }
    if (!isNotEmpty(dateOfBirth)) {
      errors.push('Please input date of birth')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        enteredValue: { username, fullname, dateOfBirth, imageUrl }
      }
    }

    let dataEntered = { username, fullname, dateOfBirth, imageUrl }
    // console.log(dataEntered)

    try {
      // if okay send to backend
      // http://localhost:3000/api/profile/update/c808c20b-9a3d-4af6-a704-fe9d0f57f1aa
      // and set error to null
      const update = await axios({
        url: `http://localhost:3000/api/profile/me/update/${profile?.id}`,
        method: 'PUT',
        data: dataEntered,
        headers: { access_token }
      })

      if (update && update.data && update.data.message) {
        navigate('/auth/home')
      } else {
        navigate('/auth/home')
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to update'
        ],
        enteredValue: { username, fullname, dateOfBirth, imageUrl }
      }
    }
  }

  const [formState, formAction] = useActionState(myProfileUpdateAction, { error: null })

  // console.log(profile)

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
          <div className='mt-4'>
            <h2 className='mt-2 text-2xl font-bold'>Edit My Profile</h2>
            {profile.imageUrl
              ? <img className='mx-auto' src={profile.imageUrl} alt={profile.username} />
              : <img className='mx-auto' src="https://placehold.co/200x200?text=No\nImage" alt={profile.username} />
            }
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="username">Username</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="username" id="username"
                  placeholder='e.g: jonthor666'
                  defaultValue={formState.enteredValue?.username ? formState.enteredValue?.username : profile.username} />
              </div>
              <div>
                <label className='block' htmlFor="fullname">Full name</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="fullname" id="fullname"
                  placeholder='e.g: Jon Thor'
                  defaultValue={formState.enteredValue?.fullname ? formState.enteredValue?.fullname : profile.fullname} />
              </div>
              <div>
                <label className='block' htmlFor="dateOfBirth">Date of Birth</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="date" name="dateOfBirth" id="dateOfBirth"
                  defaultValue={formState.enteredValue?.dateOfBirth
                    ? formState.enteredValue?.dateOfBirth
                    : (typeof profile?.dateOfBirth === 'string'
                      ? profile.dateOfBirth?.slice(0, 10)
                      : '')}
                />
              </div>
              <div>
                <label className='block' htmlFor="imageUrl">Image URL</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="imageUrl" id="imageUrl"
                  placeholder='e.g: https://placehold.co/200'
                  defaultValue={formState.enteredValue?.imageUrl ? formState.enteredValue?.imageUrl : profile.imageUrl} />
                <p className='block text-sm font-bold'>Please input your image url here</p>
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

              <button className='font-bold mt-8 cursor-pointer bg-sky-600 text-zinc-200 px-3 py-1' type='submit'>
                Submit Update
              </button>
            </form>
          </div>
        )
      }
    </main>
  )
}

export default MyProfile