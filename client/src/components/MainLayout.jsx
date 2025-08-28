import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="flex gap-4">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </article>
    </div>
  )
}

export default MainLayout