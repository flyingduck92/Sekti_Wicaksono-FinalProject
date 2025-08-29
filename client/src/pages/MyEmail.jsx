import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { useActionState } from 'react'
import { isEmail, isNotEmpty } from '../utils/validation'


function MyEmail() {
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

  /* Form Update */
  async function myProfileUpdateAction(prevFormState, formData) {
    const email = formData.get('email')

    const errors = []

    if (!isNotEmpty(email) || !isEmail(email)) {
      errors.push('Invalid email address.')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        success: null,
        enteredValue: { email }
      }
    }

    let dataEntered = { email }
    // console.log(dataEntered)
    // console.log(errors)

    try {
      // if okay send to backend
      // http://localhost:3000/api/profile/update/c808c20b-9a3d-4af6-a704-fe9d0f57f1aa
      // and set error to null
      const update = await axios({
        url: `http://localhost:3000/api/profile/me/email/${profile?.id}`,
        method: 'PUT',
        data: dataEntered,
        headers: { access_token }
      })

      if (update && update.data && update.data.message) {
        return {
          errors: null,
          success: update.data?.message || 'Email updated successfully!',
          enteredValue: { email }
        }
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to update'
        ],
        enteredValue: { email }
      }
    }
  }

  const [formState, formAction] = useActionState(myProfileUpdateAction, { error: null })

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
            <h2 className='my-2 text-2xl font-bold'>Update MyEmail</h2>
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="email">Email</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="email" id="email"
                  placeholder='e.g: hello@hello.net'
                  defaultValue={formState.enteredValue?.email ? formState.enteredValue?.email : profile.User.email} />
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

export default MyEmail