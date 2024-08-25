'use client';
import React, { useEffect, useState, useRef } from 'react';
import { usePosts } from '@/hooks/usePost';
import { DeleteModalProps } from '@/type';
import { Modal as ModalInstance } from 'bootstrap';
import { useAuth } from '@/hooks/useAuth'

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, isVisible, post, onDeleteSuccess }) => {
  const { removePost, posts } = usePosts();
  const [modalInitializer, setModalInitializer] = useState<typeof import('bootstrap').Modal | null>(null);
  const modalInstanceRef = useRef<ModalInstance | null>(null);
  const { token } = useAuth()

  useEffect(() => {
    import('bootstrap').then(bootstrap => {
      setModalInitializer(() => bootstrap.Modal);
    });
  }, []);

  useEffect(() => {
    if (modalInitializer) {
      const modalElement = document.getElementById('confirmDelModal');
      if (modalElement) {
        if (!modalInstanceRef.current) {
          modalInstanceRef.current = new modalInitializer(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
        }
        if (isVisible) {
          modalInstanceRef.current.show();
        } else {
          modalInstanceRef.current.hide();
        }
      }
    }
  }, [isVisible]);

  const handleRemovePost = async () => {

    if (!token) {
      console.error('User is not authenticated');
      return;
    } else if (!post) {
      console.error('No post selected for deletion.');
      return;
    }

    try {
      await removePost(token, post);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <>
      <div className="modal fade" id="confirmDelModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className='formArea'>
              {/* <h5 className='text-red01 text-center'>{post?.title}</h5> */}
              <div className='text-center mt-4'>Are you sure you want to delete this post (<span className='text-red01'>{post?.title}</span>)?</div>
              <div className="row justify-content-center">
                <div className="col-4">
                  <button type="button" className="btn btn-yellow02 mt-4 mb-3 rounded-pill w-100" onClick={onClose}>
                    No
                  </button>
                </div>
                <div className="col-4">
                  <button type="button" className="btn btn-red01 mt-4 mb-3 rounded-pill w-100" onClick={handleRemovePost}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
