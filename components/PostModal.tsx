import React, { useRef, useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePost';
import { Modal } from 'bootstrap';
import { Post, PostModalProps } from '@/type';
import { useAuth } from '@/hooks/useAuth'

const PostModal: React.FC<PostModalProps> = ({ mode, post, onSave, onClose, isVisible }) => {
  const { addPost, updatePost } = usePosts();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; body?: string; tags?: string }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth()
  const [availableTags] = useState<string[]>([
    "history", "american", "crime", "science", "fiction", "fantasy", "space",
    "adventure", "nature", "environment", "philosophy", "psychology", "health"
  ]);

  useEffect(() => {
    const modalElement = document.getElementById('articleModal');
    if (modalElement) {
      let modalInstance = Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
      }
      if (isVisible) {
        modalInstance.show();
      } else {
        modalInstance.hide();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (inputRef.current && tagsContainerRef.current) {
      const tagsContainerWidth = tagsContainerRef.current.offsetWidth;
      inputRef.current.style.marginLeft = `${tagsContainerWidth}px`;
    }
  }, [tags]);

  const validate = () => {
    let isValid = true;
    const errors: { title?: string; body?: string; tags?: string } = {};

    if (!title) {
      errors.title = 'Title is required.';
      isValid = false;
    }

    if (!body) {
      errors.body = 'Content is required.';
      isValid = false;
    }

    if (tags.length === 0) {
      errors.tags = 'At least one tag is required.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      if (!token) {
        console.error('User token not found');
        return;
      }

      try {
        if (mode === 'add') {
          await addPost(token, { title, body, tags });
        } else if (mode === 'edit' && post) {
          await updatePost(token, post.id, { title, body, tags });
        }
        onSave({ title, body, tags });
        onClose();
      } catch (error) {
        console.error('Failed to save post:', error);
      }
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
  };

  const handleTagRemove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (mode === 'edit' && post) {
      setTitle(post.title);
      setBody(post.body);
      setTags(post.tags);
    } else {
      setTitle('');
      setBody('');
      setTags([]);
    }
  }, [mode, post]);

  return (
    <>
      <div className="modal fade" id="articleModal"
        data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true"
        tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className='formArea'>
              <h3 className='formTitle'>{mode === 'add' ? 'Add A Post' : 'Edit Post'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputTitle" className="form-label">Title</label>
                  <input type="text" className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`} id="exampleInputTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-describedby="titleHelp" />
                  {validationErrors.title && (
                    <div className="invalid-feedback">{validationErrors.title}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="exampleInputContent" className="form-label">Content</label>
                  <textarea className={`form-control ${validationErrors.body ? 'is-invalid' : ''}`} id="exampleInputContent" rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    aria-describedby="contentHelp">{body}</textarea>
                  {validationErrors.body && (
                    <div className="invalid-feedback">{validationErrors.body}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="exampleInputTags" className="form-label">Tags</label>
                  <div className={`tags-input-container form-control ${validationErrors.tags ? 'is-invalid' : ''}`}>
                    <select className="form-select" onChange={handleTagChange} value="">
                      <option value="" disabled></option>
                      {availableTags.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <div className="tags-container" ref={tagsContainerRef}
                      id="tags">
                      {tags.map((tag, index) => (
                        <span key={index} className="input-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {validationErrors.tags && (
                      <div className="invalid-feedback d-block">{validationErrors.tags}</div>
                    )}
                  </div>
                </div>
                <div className="row justify-content-around">
                  <div className="col-4">
                    <button type="button" className="btn btn-yellow02 mt-4 mb-3 rounded-pill w-100" onClick={handleClose}>Cancel</button>
                  </div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-yellow01 mt-4 mb-3 rounded-pill w-100">
                      {mode === 'add' ? 'Add' : 'Edit'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostModal;
