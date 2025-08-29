import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useActionState } from 'react'
import { isEmail, isNotEmpty, hasMinLength } from '../utils/validation'
import axios from 'axios'

function UserEdit() {
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
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!access_token) return
    const fetchUser = async () => {
      try {
        const res = await axios({
          url: `http://localhost:3000/api/user/${id}`,
          headers: { access_token }
        })
        setUser(res.data.data) // adjust if your backend returns differently
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tool')
      }
    }
    fetchUser()
  }, [access_token, id])

  /* Form Update */
  async function myUserAction(prevFormState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    const errors = []
    if (!isNotEmpty(email) || !isEmail(email)) {
      errors.push('Invalid email address.')
    }

    // only validate if password not empty
    if (isNotEmpty(password) && !hasMinLength(password, 6)) {
      errors.push('Password at least six characters.')
    }


    // if error 
    if (errors.length > 0) {
      return {
        errors,
        success: null,
        enteredValue: { email, password }
      }
    }

    // include password if not empty
    let dataEntered = { email }
    if (isNotEmpty(password)) {
      dataEntered.password = password
    }

    try {
      // if okay send to backend
      // http://localhost:3000/api/tool/create
      // and set error to null
      const res = await axios({
        url: `http://localhost:3000/api/user/update/${id}`,
        method: 'PUT',
        data: dataEntered,
        headers: { access_token }
      })
      if (res && res.data && res.data.message) {
        return {
          errors: null,
          success: res.data?.message || 'User has been updated successfully!',
          enteredValue: { email, password: null }
        }
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to update'
        ],
        enteredValue: { email, password }
      }
    }
  }

  const [formState, formAction] = useActionState(myUserAction, { error: null })

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
          <div>
            <h2 className='my-2 text-2xl font-bold'>Edit User</h2>
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="email">Email</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="email" id="email"
                  placeholder='e.g: hello@hello.net'
                  defaultValue={formState.enteredValue?.email ? formState.enteredValue?.email : user?.email}
                />
              </div>
              <div>
                <label className='block' htmlFor="password">Password</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="password" name="password" id="password"
                  placeholder='e.g: your_secret_password'
                  defaultValue={null}
                /><br />
                <small className='inline-block font-bold text-black'>
                  NOTE: Please leave blank if you want to keep the current password
                </small>
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

              <button className='mt-6 cursor-pointer bg-sky-600 text-zinc-200 px-3 py-1' type='submit'>
                Update this User
              </button>
            </form>

          </div>
        )
      }
    </main>
  )
}

export default UserEdit