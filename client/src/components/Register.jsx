import { useActionState } from 'react'
import { isEmail, isNotEmpty, hasMinLength, isEqualToOtherValue } from '../utils/validation'
import axios from 'axios'

function Register({ onRegisterSuccess }) {

  async function registerAction(prevFormState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    const errors = []

    if (!isNotEmpty(email) || !isEmail(email)) {
      errors.push('Invalid email address.')
    }
    if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
      errors.push('Password at least six characters.')
    }
    if (!isEqualToOtherValue(confirmPassword, password)) {
      errors.push('Password doesn\'t match.')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        enteredValue: { email, password, confirmPassword }
      }
    }

    let dataEntered = { email, password }
    // console.log(dataEntered)

    try {
      // if okay send to backend 
      // http://localhost:3000/api/user/create
      // and set error to null
      const register = await axios({
        url: 'http://localhost:3000/api/user/create',
        method: 'POST',
        data: dataEntered
      })

      if (register && register.data && register.data.message) {
        onRegisterSuccess(register.data.message)
      } else {
        onRegisterSuccess('Successfully register.')
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to register'
        ],
        enteredValue: { email, password, confirmPassword }
      }
    }
  }

  const [formState, formAction] = useActionState(registerAction, { error: null })

  return (
    <article className='container border border-blue-900 text-white bg-blue-600 p-8 rounded-lg'>
      <h2 className='text-2xl font-bold'>Register</h2>
      <form className='mt-8' action={formAction}>
        <div className='container flex flex-col'>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" name='email'
            className='p-2 text-black bg-zinc-200'
            defaultValue={formState.enteredValue?.email} />
        </div>
        <div className='container flex flex-col'>
          <label htmlFor="password">Password</label>
          <input
            className='p-2 text-black bg-zinc-200'
            id="password" type="password" name='password'
            defaultValue={formState.enteredValue?.password} />
        </div>
        <div className='container flex flex-col'>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className='p-2 text-black bg-zinc-200'
            id="confirmPassword" type="password" name='confirmPassword'
            defaultValue={formState.enteredValue?.confirmPassword} />
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
          Register
        </button>
      </form>


    </article>
  )

}

export default Register