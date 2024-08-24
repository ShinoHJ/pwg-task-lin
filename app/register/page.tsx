'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link'
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Modal } from 'bootstrap';
import Image from 'next/image';
import useFormValidation from '@/hooks/useValidateForm';
import { Modal as ModalInstance } from 'bootstrap';

const RegisterPage: React.FC = () => {
  const { register } = useUser();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const { validationErrors, validateForm } = useFormValidation({ username, email, password, role }, true);
  const [modalInitializer, setModalInitializer] = useState<((element: HTMLElement) => ModalInstance) | null>(null);

  useEffect(() => {
    import('bootstrap').then(bootstrap => {
      setModalInitializer(() => (element: HTMLElement) => new bootstrap.Modal(element) as ModalInstance);
    });
  }, []);

  // const showSuccessModal = () => {
  //   if (typeof window !== 'undefined') {
  //     const element = document.getElementById('successModal') as HTMLElement
  //     const successModal = new Modal(element)
  //     successModal.show()

  //     setTimeout(() => {
  //       successModal.hide()
  //       router.push('/login')
  //     }, 1500)
  //   }
  // }

  const showSuccessModal = useCallback(() => {
    if (modalInitializer) {
      const element = document.getElementById('successModal');
      if (element) {
        const successModal = modalInitializer(element);
        successModal.show();

        setTimeout(() => {
          successModal.hide();
          router.push('/login');
        }, 1500);
      }
    }
  }, [modalInitializer, router]);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValid = validateForm()
    if (!isValid) {
      return
    }

    try {
      await register(username, email, password, role)
      showSuccessModal()
    } catch (errer) {
      setError('Registration failed. Please try again.');
    }
  }

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className='formArea'>
          <h3 className='formTitle'>Register User</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="pwgInputUsername" className="form-label">Username</label>
              <input type="text" className={`form-control rounded-pill ${validationErrors.username ? 'is-invalid' : ''}`} id="pwgInputUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby="usernameHelp" />
              {validationErrors.username && (
                <div className="ps-2 invalid-feedback">{validationErrors.username}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pwgInputEmail1" className="form-label">Email</label>
              <input type="email" className={`form-control rounded-pill ${validationErrors.email ? 'is-invalid' : ''}`} id="pwgInputEmail1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="emailHelp" />
              {validationErrors.email && (
                <div className="ps-2 invalid-feedback">{validationErrors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pwgInputPassword1" className="form-label">Password</label>
              <input type="password" className={`form-control rounded-pill ${validationErrors.password ? 'is-invalid' : ''}`} id="pwgInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {validationErrors.password && (
                <div className="ps-2 invalid-feedback">{validationErrors.password}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pwgInputRole" className="form-label">Role</label>
              <select
                className={`form-control rounded-pill ${validationErrors.role ? 'is-invalid' : ''}`}
                id="pwgInputRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {validationErrors.role && (
                <div className="ps-2 invalid-feedback">{validationErrors.role}</div>
              )}
            </div>
            <button type="submit" className="btn btn-yellow01 w-100 mt-4 mb-3">Register</button>
            <div className='text-center'>
              <Link href="/login" className='text-yellow01 fs-5 text m-auto'>Back to Login Page</Link></div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <div className="modal fade" id="successModal" tabIndex={-1} aria-labelledby="successModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body d-flex flex-column align-items-center">
              <Image alt='' src='/successIcon.svg' width={40} height={40} className='m-4' />
              <p className='w-100 text-center mb-4'>Account registered successfully</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default RegisterPage;