'use client'
import React, { useEffect, useState } from 'react'
import Toolbar from '@/components/Toolbar'
import { usePosts } from '@/hooks/usePost';
import { Post } from '@/type';
import { useAuth } from '@/hooks/useAuth';

type Params = {
  params: {
    id: number
  }
}

const ViewPostPage: React.FC<Params> = ({ params }) => {
  const { id } = params;
  const { getPost } = usePosts();
  const [post, setPost] = useState<Post | null>(null);
  const { token } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      if (token) {
        const fetchedPost = await getPost(token, id);
        setPost(fetchedPost);
      } else {
        console.error('No token available');
      }
    };

    fetchPost();
  }, [id, getPost]);

  return (
    <>
      <Toolbar showGoBackButton />
      {post ? (
        <div className="container d-flex flex-column justify-content-top align-items-center vh-100">
          <h2 className='formTitle'>View Post</h2>
          <div className='articleArea'>
            <h4 className='articleTitle'>{post.title}</h4>
            <p className='articleContent'>{post.body}</p>

            <div className='tag mt-5'>
              {post.tags.map((tag, index) => (
                <button key={index} type="button" className="btn btn-yellow02 rounded-pill px-4">{tag}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default ViewPostPage