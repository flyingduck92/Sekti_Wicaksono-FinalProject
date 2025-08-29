import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import { useActionState } from 'react'
import { hasMinLength, isNotEmpty } from '../utils/validation'


function ToolEdit() {
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
  const [tool, setTool] = useState(null)

  useEffect(() => {
    if (!access_token) return
    const fetchCategory = async () => {
      try {
        const res = await axios({
          url: `http://localhost:3000/api/tool/${id}`,
          headers: { access_token }
        })
        setTool(res.data.data) // adjust if your backend returns differently
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tool')
      }
    }
    fetchCategory()
  }, [access_token, id])

  // fetch categories
  const [categories, setCategories] = useState([])

  useEffect(()=> {
    if (!access_token) return
    const fetchCategories = async () => {
      try {
        const res = await axios({
          url: `http://localhost:3000/api/category/all`, // adjust endpoint if needed
          method: 'GET',
          headers: { access_token }
        })
        setCategories(res.data?.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Categories failed to fetch')
      }
    }
    fetchCategories()
  },[access_token])

  /* Form Update */
  async function myToolAction(prevFormState, formData) {
    const code = formData.get('code')
    const name = formData.get('name')
    const price = formData.get('price')
    const stock = formData.get('stock')
    const imageUrl = formData.get('imageUrl') // optional
    const CategoryId = formData.get('CategoryId')

    const errors = []
    if (!isNotEmpty(code) || !hasMinLength(code, 5)) {
      errors.push('Tool code at least five characters.')
    }
    if (!isNotEmpty(name) || !hasMinLength(name, 6)) {
      errors.push('Tool name at least six characters.')
    }
    if (!isNotEmpty(price)) {
      errors.push('Price is required.')
    }
    if (!isNotEmpty(stock)) {
      errors.push('Stock is required.')
    }
    if (!isNotEmpty(CategoryId)) {
      errors.push('CategoryId is required.')
    }

    // if error 
    if (errors.length > 0) {
      return {
        errors,
        success: null,
        enteredValue: { code, name, price, stock, imageUrl, CategoryId }
      }
    }

    let dataEntered = { code, name, price, stock, imageUrl, CategoryId }

    try {
      // if okay send to backend
      // http://localhost:3000/api/tool/create
      // and set error to null
      const res = await axios({
        url: `http://localhost:3000/api/tool/update/${id}`,
        method: 'PUT',
        data: dataEntered,
        headers: { access_token }
      })
      if (res && res.data && res.data.message) {
        return {
          errors: null,
          success: res.data?.message || 'Tool has been updated successfully!',
          enteredValue: { code, name, price, stock, imageUrl, CategoryId  }
        }
      }

      return { errors: null }
    } catch (err) {
      return {
        errors: [
          err.response?.data?.message || 'Failed to add'
        ],
        enteredValue: { code, name, price, stock, imageUrl, CategoryId }
      }
    }
  }

  const [formState, formAction] = useActionState(myToolAction, { error: null })

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
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="code">Tool Code</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="code" id="code"
                  defaultValue={formState.enteredValue?.code ? formState.enteredValue?.code : tool?.code}
                />
              </div>
              <div>
                <label className='block' htmlFor="name">Tool Name</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="name" id="name"
                  defaultValue={formState.enteredValue?.name ? formState.enteredValue?.name : tool?.name}
                />
              </div>
              <div>
                <label className='block' htmlFor="price">Price</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="price" id="price"
                  defaultValue={formState.enteredValue?.price ? formState.enteredValue?.price : tool?.price}
                />
              </div>
              <div>
                <label className='block' htmlFor="stock">Stock</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="stock" id="stock"
                  defaultValue={formState.enteredValue?.stock ? formState.enteredValue?.stock : tool?.stock}
                />
              </div>
              <div>
                <label className='block' htmlFor="imageUrl">Image URL</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="imageUrl" id="imageUrl"
                  defaultValue={formState.enteredValue?.imageUrl ? formState.enteredValue?.imageUrl : tool?.imageUrl}
                />
              </div>
              <div>
                <label className='block' htmlFor="CategoryId">Category</label>
                <select id="CategoryId" name="CategoryId"
                  className='px-3 py-1 bg-zinc-400 w-[250px]'
                  key={formState.enteredValue?.CategoryId}
                  defaultValue={formState.enteredValue?.CategoryId ? formState.enteredValue?.CategoryId : tool?.CategoryId}
                >
                  {
                    categories.map(c=> (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
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
                Update a Tool
              </button>
            </form>

          </div>
        )
      }
    </main>
  )
}

export default ToolEdit