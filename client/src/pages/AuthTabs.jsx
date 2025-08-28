import { useState } from "react"
import Register from '../components/Register'
import Login from '../components/Login'

export default function AuthTabs() {
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [notification, setNotification] = useState('')

  function handleRegisterSuccess(message) {
    setIsLoginPage(true)
    setNotification(message)
  }

  return (
    <main className="w-full">
      <article className='relative'>
        {
          notification && (
            <div className="mb-2 p-2 bg-green-500 text-zinc-100 font-bold rounded-sm">
              {notification}
            </div>
          )
        }
        <ul className='flex flex-wrap p-1.5 list-none rounded-md bg-slate-100'>
          <li onClick={() => setIsLoginPage(true)} className='flex-auto text-center'>
            <a className='flex items-center justify-center w-full px-0 py-2 mb-0 transition-colors ease-in-out border-0 rounded-md cursor-pointer bg-inherit text-slate-600'>
              Login
            </a>
          </li>
          <li onClick={() => setIsLoginPage(false)} className='flex-auto text-center'>
            <a className='flex items-center justify-center w-full px-0 py-2 mb-0 transition-colors ease-in-out border-0 rounded-md cursor-pointer bg-inherit text-slate-600'>
              Register
            </a>
          </li>
        </ul>
        <main className='mt-20'>
          {isLoginPage ? (
            <Login />
          ) : (
            <Register onRegisterSuccess={handleRegisterSuccess} />
          )}
        </main>
      </article>
    </main>
  )
}