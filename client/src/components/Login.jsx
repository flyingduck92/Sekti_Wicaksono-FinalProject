import { useActionState } from 'react'
import { isEmail, isNotEmpty, hasMinLength } from '../utils/validation'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  async function loginAction(prevFormState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    const errors = []

    if (!isNotEmpty(email) || !isEmail(email)) {
      errors.push('Invalid email address.')
    }
    if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
      errors.push('Password at least six characters.')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        enteredValue: { email, password }
      }
    }

    let dataEntered = { email, password }
    // console.log(dataEntered)

    try {
      // if okay send to backend
      // http://localhost:3000/api/user/login
      // and set error to null
      const login = await axios({
        url: 'http://localhost:3000/api/user/login',
        method: 'POST',
        data: dataEntered
      })

      // get access_token
      const access_token = login.data?.data?.access_token
      if (access_token) {
        localStorage.setItem('access_token', access_token)
        navigate('/auth/home')
      }
      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to login'
        ],
        enteredValue: { email, password }
      }
    }
  }

  const [formState, formAction] = useActionState(loginAction, { error: null })

  return (
    <article className='container border border-blue-900 text-white bg-blue-600 p-8 rounded-lg'>
      <h2 className='text-2xl font-bold'>Login</h2>
      <form className='mt-8' action={formAction}>
        <div className='container flex flex-col'>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" name='email'
            className='p-2 text-black bg-zinc-200'
            placeholder='Enter your email'
            defaultValue={formState.enteredValue?.email} />
        </div>
        <div className='container flex flex-col'>
          <label htmlFor="password">Password</label>
          <input
            className='p-2 text-black bg-zinc-200'
            id="password" type="password" name='password'
            placeholder='Enter your password'
            defaultValue={formState.enteredValue?.password} />
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

        <button className="font-bold cursor-pointer mt-4 px-8 py-4 bg-sky-700 text-zinc-200 hover:">
          Login
        </button>
      </form>

    </article>
  )
}

export default Login