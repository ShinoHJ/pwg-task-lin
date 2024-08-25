'use client';
import React, { useRef, useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePost';
import { Modal } from 'bootstrap';
import { Post, PostModalProps } from '@/type';
import { useAuth } from '@/hooks/useAuth'
import { Modal as ModalInstance } from 'bootstrap';

const PostModal: React.FC<PostModalProps> = ({ mode, post, onSave, onClose, isVisible }) => {
  const { addPost, updatePost } = usePosts();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; body?: string; tags?: string }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth()
  const [availableTags] = useState<string[]>([
    "history", "american", "crime", "science", "fiction", "fantasy", "space",
    "adventure", "nature", "environment", "philosophy", "psychology", "health"
  ]);
  const [modalInitializer, setModalInitializer] = useState<typeof import('bootstrap').Modal | null>(null);
  const modalInstanceRef = useRef<ModalInstance | null>(null);

  useEffect(() => {
    import('bootstrap').then(bootstrap => {
      setModalInitializer(() => bootstrap.Modal);
    });
  }, []);

  useEffect(() => {
    if (modalInitializer) {
      const modalElement = document.getElementById('articleModal');
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
  }, [isVisible, modalInitializer]);


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

  const validateTitle = () => {
    if (!title) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        title: 'Title is required',
      }));
      return false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        title: '',
      }));
      return true;
    }
  };

  const validateBody = () => {
    if (!body) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        body: 'Content is required',
      }));
      return false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        body: '',
      }));
      return true;
    }
  };

  const validateTags = () => {
    if (tags.length === 0) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        tags: 'Please select at least one tag',
      }));
      return false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        tags: '',
      }));
      return true;
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (validationErrors.title) {
      setValidationErrors(prevErrors => ({ ...prevErrors, title: '' }));
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setBody(newBody);

    if (validationErrors.body) {
      setValidationErrors(prevErrors => ({ ...prevErrors, body: '' }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    setSelectedTag('');

    if (validationErrors.tags) {
      setValidationErrors(prevErrors => ({ ...prevErrors, tags: '' }));
    }
  };

  const handleTitleBlur = () => {
    validateTitle();
  };

  const handleBodyBlur = () => {
    validateBody();
  };

  const handleTagsBlur = () => {
    validateTags();
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

  const handleTagRemove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };


  const handleClose = () => {
    onClose();
    setValidationErrors({ title: '', body: '', tags: '' });
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
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    aria-describedby="titleHelp" />
                  {validationErrors.title && (
                    <div className="invalid-feedback">{validationErrors.title}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="exampleInputContent" className="form-label">Content</label>
                  <textarea className={`form-control ${validationErrors.body ? 'is-invalid' : ''}`} id="exampleInputContent" rows={4}
                    value={body}
                    onChange={handleBodyChange}
                    onBlur={handleBodyBlur}
                    aria-describedby="contentHelp" />
                  {validationErrors.body && (
                    <div className="invalid-feedback">{validationErrors.body}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="exampleInputTags" className="form-label">Tags</label>
                  <div className={`tags-input-container form-control ${validationErrors.tags ? 'is-invalid' : ''}`}>
                    <select className="form-select"
                      onChange={handleTagsChange}
                      onBlur={handleTagsBlur}
                      value={selectedTag}>
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
                        <span key={index} className="input-tag"
                          onClick={() => handleTagRemove(index)}
                        >
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
