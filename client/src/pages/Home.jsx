import { jwtDecode } from 'jwt-decode'

function Home() {
  // get access_token from localStorage
  const access_token = localStorage.getItem('access_token')

  let decoded = null
  if (access_token) {
    decoded = jwtDecode(access_token)
  }

  return (
    <div className="container">
      <h1>Home Page</h1>
      {
        decoded ?
          (
            <div>
              <p><strong>ID: </strong> {decoded.id}  </p>
              <p><strong>Email: </strong>{decoded.email}  </p>
              <p><strong>Role: </strong>{decoded.role}  </p>
              <p><strong>Profile ID: </strong>{decoded.profileId}  </p>
            </div>
          )
          : (
            <p>No access_token. Please login</p>
          )
      }
    </div>
  )
}

export default Home