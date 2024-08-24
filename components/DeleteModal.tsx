'use client';
import React, { useEffect, useState, useRef } from 'react';
import { usePosts } from '@/hooks/usePost';
import { Modal } from 'bootstrap';
import { Post, DeleteModalProps } from '@/type';
import { Modal as ModalInstance } from 'bootstrap';

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, isVisible, postId, onDeleteSuccess }) => {
  const { removePost } = usePosts();
  const [modalInitializer, setModalInitializer] = useState<typeof import('bootstrap').Modal | null>(null);
  const modalInstanceRef = useRef<ModalInstance | null>(null);

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
    const userToken = localStorage.getItem('token') || '';

    if (!userToken) {
      console.error('User is not authenticated');
      return;
    }

    try {
      await removePost(userToken, postId);
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
              <h5 className='text-red01 text-center'>Post Title</h5>
              <div className='text-center mt-4'>Are you sure you want to delete this post?</div>
              <div className="row justify-content-center">
                <div className="col-4">
                  <button type="button" className="btn btn-yellow02 mt-4 mb-3 rounded-pill w-100" onClick={onClose}>
                    Cancel
                  </button>
                </div>
                <div className="col-4">
                  <button type="button" className="btn btn-red01 mt-4 mb-3 rounded-pill w-100" onClick={handleRemovePost}>
                    Delete
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
