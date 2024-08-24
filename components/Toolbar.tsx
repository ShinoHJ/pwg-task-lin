import { useRouter } from 'next/navigation'
import React from 'react'
import { useUser } from '@/hooks/useUser';
import { usePosts } from '@/hooks/usePost';
import { useEffect } from 'react';

interface ToolbarProps {
  showAddPostButton?: boolean
  showGoBackButton?: boolean
  onAdd?: () => void;
}
const Toolbar: React.FC<ToolbarProps> = ({ showAddPostButton, showGoBackButton, onAdd }) => {
  const router = useRouter();
  const { logout } = useUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleGoBack = () => {
    router.back()
  }
  return (
    <div className='container'>
      <nav className='mt-5'>
        <div className='px-3 d-flex justify-content-between'>
          {showGoBackButton && <button onClick={handleGoBack} className='btn btn-yellow01 rounded-pill px-4'>Back</button>}
          {showAddPostButton &&
            <button onClick={onAdd} data-bs-toggle="modal" data-bs-target="#articleModal" className='btn btn-yellow01 rounded-pill px-4' >Add New Post</button>}
          <button onClick={handleLogout} className='btn text-red01 fs-5 text'>Logout</button>
        </div>
      </nav>
    </div>
  )
}
export default Toolbar
