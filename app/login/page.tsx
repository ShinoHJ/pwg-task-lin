'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useFormValidation from '@/hooks/useValidateForm';
import { Modal as ModalInstance } from 'bootstrap';

const LoginPage: React.FC = () => {
  const { user, login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  const [_, setError] = useState<string | null>(null);
  const { validationErrors, validateForm, handleBlur } = useFormValidation({ email, password }, false);
  const [modalInitializer, setModalInitializer] = useState<((element: HTMLElement) => ModalInstance) | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    import('bootstrap').then(bootstrap => {
      setModalInitializer(() => (element: HTMLElement) => new bootstrap.Modal(element) as ModalInstance);
    });
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateForm();
    handleBlur('email')
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validateForm();
    handleBlur('password')
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    validateForm(true)

    try {
      setIsLoading(false)
      await login(email, password);
      if (modalInitializer) {
        const element = document.getElementById('successModal') as HTMLElement;
        const successModal = modalInitializer(element);
        successModal.show()
        setTimeout(() => {
          successModal.hide()
          router.push('/post-list')
        }, 1500)
      }
    } catch (error: any) {
      if (error.status === 400) {
        return
      } else if (error.status === 401) {
        validateForm(true);
        setError('Login failed. Please check your credentials.');
        const element = document.getElementById('errorModal');
        if (element && modalInitializer) {
          const modal = modalInitializer(element);
          modal.show();
        }
      }
      setIsLoading(false)
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className='formArea'>
          <h3 className='formTitle'>Login Page </h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="pwgInputEmail1" className="form-label">Email</label>
              <input type="email" className={`form-control rounded-pill ${validationErrors.email ? 'is-invalid' : ''}`} id="pwgInputEmail1"
                value={email}
                onChange={handleEmailChange}
                aria-describedby="emailHelp"
                disabled={isLoading} />
              {validationErrors.email && (
                <div className="ps-2 invalid-feedback">{validationErrors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pwgInputPassword1" className="form-label">Password</label>
              <input type="password" className={`form-control rounded-pill ${validationErrors.password ? 'is-invalid' : ''}`} id="pwgInputPassword1"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
              />
              {validationErrors.password && (
                <div className="ps-2 invalid-feedback">{validationErrors.password}</div>
              )}
            </div>
            <button type="submit" className="btn btn-yellow01 w-100 mt-4 mb-3"
              disabled={isLoading}
            >Login</button>
            {isLoading && <p className="pending-status text-center text-red01">Logging in...</p>}
            <div className='text-center'>
              <Link href="/register" className='text-yellow01 fs-5 text m-auto' style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>Create an account</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <div className="modal fade" id="successModal" tabIndex={-1} aria-labelledby="successModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body d-flex flex-column align-items-center">
              <Image alt='' src='/successIcon.svg' width={40} height={40} className='m-4' />
              <p className='w-100 text-center mb-4'>{user?.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <div className="modal fade" id="errorModal" tabIndex={-1} aria-labelledby="errorModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body d-flex flex-column align-items-center">
              <Image alt='' src='/invalidIcon.svg' width={40} height={40} className='m-4' />
              <p className='w-100 text-center mb-4'>Invalid credentials</p>
              <button type="button" className="btn btn-yellow01 rounded-pill mb-4 px-5" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default LoginPage;