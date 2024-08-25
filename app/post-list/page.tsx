'use client';
import React, { useEffect, useState } from 'react'
import Toolbar from '@/components/Toolbar'
import PostModal from '@/components/PostModal'
import DeleteModal from '@/components/DeleteModal'
import { useRouter } from 'next/navigation';
import { usePosts } from '@/hooks/usePost';
import Pagination from '@/components/Pagination';
import { Post, ModalState, DelModalState } from '@/type';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth'

const PostList: React.FC<Post> = ({ }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, fetchPostsBasedOnRole, removePost, totalPages } = usePosts()
  const [modalState, setModalState] = useState<ModalState>({
    mode: 'add',
    showModal: false,
    editingPost: null
  });
  const [delModalState, setDelModalState] = useState<DelModalState>({
    showModal: false,
    postId: 0,
  });
  const { token, isAdmin } = useAuth()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updateDashboard, setUpdateDashboard] = useState(false);
  const [statisticsToUpdate, setStatisticsToUpdate] = useState<string[]>([]);

  useEffect(() => {
    if (isAdmin && token) {
      fetchPostsBasedOnRole(token, currentPage, 10);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNewPost = () => {
    setModalState({
      mode: 'add',
      showModal: true,
      editingPost: null
    });
  };

  const handleEditPost = (post: Post) => {
    setModalState({
      mode: 'edit',
      showModal: true,
      editingPost: post
    });
  };

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setDelModalState({ showModal: true, postId: post.id });
  };

  const handleCloseModal = () => {
    setModalState({
      mode: 'add',
      showModal: false,
      editingPost: ''
    });

    setDelModalState({
      showModal: false,
      postId: 0,
    });
  };

  // const handleRemovePost = async (postId: number) => {
  //   const userToken = localStorage.getItem('token') || '';

  //   if (!userToken) {
  //     console.error('User is not authenticated');
  //     return;
  //   }

  //   setDelModalState({
  //     showModal: true,
  //     postId: postId,
  //   });
  // };

  const handleSavePost = async () => {
    if (token) {
      await fetchPostsBasedOnRole(token, currentPage, 10);
      setStatisticsToUpdate(['totalPosts', 'userPosts']);
      setUpdateDashboard(true)
    }
    handleCloseModal();
  };

  const handleDeleteSuccess = async () => {
    if (token) {
      await fetchPostsBasedOnRole(token, currentPage, 10);
      setStatisticsToUpdate(['totalPosts', 'userPosts']);
      setUpdateDashboard(true);
    }
  };

  return (
    <>
      <Toolbar showAddPostButton onAdd={handleAddNewPost} />
      <div className="container d-flex flex-column justify-content-top align-items-center vh-100">
        <h2 className='formTitle mt-4'>Post List</h2>

        {isAdmin && token &&
          <Dashboard
            adminToken={token}
            userToken={token}
            shouldUpdate={updateDashboard}
            onUpdateComplete={() => setUpdateDashboard(false)}
            statisticsToUpdate={statisticsToUpdate} 
          />
        }
        <div className="row w-100">
          {posts.map(post => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
              <div className='listArea'>
                <div className="postTime mb-4 mb-md-5 text-yellow01">{post.date}</div>
                <h4 className='listTitle'>{post.title}</h4>
                <p className='listContent text-multiline-truncate'>{post.body}</p>
                <div className='tag'>
                  {post.tags.map((tag, index) => (
                    <button key={index} type="button" className="btn btn-yellow02 rounded-pill px-4">{tag}</button>
                  ))}
                </div>
                <div className='btn-group mt-4 d-flex justify-content-center'>
                  <button type="button" className="btn btn-green02 rounded-pill w-100" onClick={() => handleEditPost(post)}>Edit</button>
                  <button type="button" className="btn btn-yellow01 rounded-pill w-100" onClick={() => router.push(`/post/${post.id}`)}>View</button>
                  <button type="button" className="btn btn-red01 rounded-pill w-100" onClick={() => handleSelectPost(post)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

      </div >

      {/* Modal */}
      < PostModal
        mode={modalState.mode}
        post={modalState.editingPost}
        onSave={handleSavePost}
        onClose={handleCloseModal}
        isVisible={modalState.showModal}
      />


      <DeleteModal
        post={selectedPost}
        onClose={handleCloseModal}
        isVisible={delModalState.showModal}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default PostList