
/* eslint-disable no-unused-vars */

import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function About() {
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

  return (
    <>
      <h1>About Page</h1>

      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta accusantium, vel expedita accusamus quibusdam exercitationem velit doloremque, nisi cupiditate eos, et error ullam? Recusandae accusantium fugit sit neque error voluptas.
        Laborum deleniti necessitatibus quaerat ex nam obcaecati, odit facere tempore recusandae quasi ipsam possimus, libero aut a praesentium natus aliquid laudantium sequi, provident ea? Blanditiis officia voluptatem maiores laborum vel.
        Quaerat aperiam corrupti repellendus. Laborum nesciunt, explicabo aperiam possimus asperiores ex natus voluptatem quidem sint deleniti ab ullam optio eveniet assumenda pariatur officia deserunt quas, cumque non maiores delectus minus.
        Eos, possimus fugit! Rem dolore et vitae tempore aut, beatae atque animi neque incidunt? Adipisci, suscipit. Aliquam quos molestiae illo ab nam! Culpa, assumenda. Porro est dolores consequuntur ut? Id!
        Officia adipisci iure explicabo optio, ad quod consequatur totam error fuga harum placeat quam inventore maiores, aperiam hic nihil sed deserunt rerum cum! Autem nostrum esse hic soluta quibusdam! Non.</p>
    </>
  )
}

export default About