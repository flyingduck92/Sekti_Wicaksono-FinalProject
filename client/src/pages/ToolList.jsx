import { jwtDecode } from 'jwt-decode'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

import { useActionState } from 'react'
import { hasMinLength, isNotEmpty } from '../utils/validation'

function ToolList() {
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

  // fetch categories
  const [categories, setCategories] = useState([])

  useEffect(() => {
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
  }, [access_token])

  //fetch tools
  const [tools, setTools] = useState([])
  const [total, setTotal] = useState(0)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginateTools = tools

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [tools, totalPages, currentPage])

  const fetchTools = useRef(async (page = 1, pageSize = 10) => {
    try {
      const offset = (page - 1) * pageSize
      const res = await axios({
        url: `http://localhost:3000/api/tool?limit=${pageSize}&offset=${offset}`,
        method: 'GET',
        headers: { access_token }
      })
      setTotal(res.data?.data?.total)
      setTools(res.data?.data?.tools || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Tools failed to fetch')
    }
  })

  useEffect(() => {
    if (!access_token) {
      navigate('/')
    }
    fetchTools.current(currentPage, pageSize)
  }, [access_token, currentPage, pageSize, navigate])

  /* Form Add */
  async function toolAddAction(prevFormState, formData) {
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
        url: `http://localhost:3000/api/tool/create`,
        method: 'POST',
        data: dataEntered,
        headers: { access_token }
      })
      if (res && res.data && res.data.message) {
        await fetchTools.current()
        return {
          errors: null,
          success: res.data?.message || 'New Tool has been added successfully!',
          enteredValue: { code: null, name: null, price: null, stock: null, imageUrl: null, CategoryId: categories[0]?.id || '' }
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

  const [formState, formAction] = useActionState(toolAddAction, { error: null })

  // Modal 
  const [showModal, setShowModal] = useState(false)
  const [selectedToolId, setSelectedToolId] = useState(null)

  const deleteToolHandler = async (id) => {
    try {
      await axios({
        url: `http://localhost:3000/api/tool/delete/${id}`,
        method: 'DELETE',
        headers: { access_token }
      })
      await fetchTools.current(currentPage, pageSize)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    }
  }

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
            <h2 className='my-2 text-2xl font-bold'>Tool List</h2>
            <form action={formAction}>
              <div>
                <label className='block' htmlFor="code">Tool Code</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="code" id="code"
                  placeholder='e.g: AS-222'
                  defaultValue={formState.enteredValue?.code}
                />
              </div>
              <div>
                <label className='block' htmlFor="name">Tool Name</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="name" id="name"
                  placeholder='e.g: Besi Batangan 2M'
                  defaultValue={formState.enteredValue?.name}
                />
              </div>
              <div>
                <label className='block' htmlFor="price">Price</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="price" id="price"
                  placeholder='e.g: 35000'
                  defaultValue={formState.enteredValue?.price}
                />
              </div>
              <div>
                <label className='block' htmlFor="stock">Stock</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="stock" id="stock"
                  placeholder='e.g: 50'
                  defaultValue={formState.enteredValue?.stock}
                />
              </div>
              <div>
                <label className='block' htmlFor="imageUrl">Image URL</label>
                <input className='px-3 py-1 bg-zinc-400 w-[250px]'
                  type="text" name="imageUrl" id="imageUrl"
                  placeholder='e.g: https://placehold.co/200'
                  defaultValue={formState.enteredValue?.imageUrl}
                />
              </div>
              <div>
                <label className='block' htmlFor="CategoryId">Category</label>
                <select id="CategoryId" name="CategoryId"
                  className='px-3 py-1 bg-zinc-400 w-[250px]'
                  key={formState.enteredValue?.CategoryId}
                  defaultValue={formState.enteredValue?.CategoryId}
                >
                  {
                    categories.map(c => (
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

              <button className='font-bold mt-6 cursor-pointer bg-sky-600 text-zinc-200 px-3 py-1' type='submit'>
                Add a Tool
              </button>
            </form>

            {/* Table List */}
            <p className='mt-4'>Total: {total}</p>
            <table className="mt-4 min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">No.</th>
                  <th className="border px-4 py-2">Tool Code</th>
                  <th className="border px-4 py-2">Tool Name</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Stock</th>
                  <th className="border px-4 py-2">Added by</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  paginateTools.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">No categories found.</td>
                    </tr>
                  ) : (
                    paginateTools.map((c, index) => {
                      let numbering = (currentPage - 1) * pageSize + (index + 1)
                      return (
                        <tr key={c.id}>
                          <td className="border px-4 py-2">{numbering}</td>
                          <td className="border px-4 py-2">{c.code}</td>
                          <td className="border px-4 py-2">{c.name}</td>
                          <td className="border px-4 py-2">Rp. {c.price.toLocaleString('id')}</td>
                          <td className="border px-4 py-2">{c.stock}</td>
                          <td className="border px-4 py-2">{c.Profile.fullname}</td>
                          <td className="border px-4 py-2">
                            {c.imageUrl
                              ? <img src={c.imageUrl} alt={c.code} />
                              : <img src="https://placehold.co/200x200?text=No\nImage" alt={c.code} />
                            }
                          </td>
                          <td className="border px-4 py-2">
                            {categories.find(cat => cat.id === c.CategoryId)?.name}
                          </td>
                          <td className="border px-4 py-2">
                            <Link
                              to={`/auth/tool/edit/${c.id}`}
                              className="cursor-pointer bg-blue-500 text-white px-2 py-1 mr-2 rounded inline-block"
                            >
                              Edit
                            </Link>
                            <button onClick={() => {
                              setSelectedToolId(c.id)
                              setShowModal(true)
                            }} className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </td>
                        </tr>
                      )
                    })
                  )
                }
              </tbody>
            </table>

            {/* MODAL START*/}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-red-300/30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p>Are you sure you want to delete this?</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={async () => {
                        await deleteToolHandler(selectedToolId)
                        setShowModal(false)
                        setSelectedToolId(null)
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setSelectedToolId(null)
                      }}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* MODAL END */}

            {/* pagination control */}
            <div className="flex gap-2 mt-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="font-bold px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages || tools.length === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="font-bold px-2 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
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

export default ToolList