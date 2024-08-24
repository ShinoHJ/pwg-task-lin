'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Modal } from 'bootstrap';
import Image from 'next/image';
import useFormValidation from '@/hooks/useValidateForm';

const LoginPage: React.FC = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const { validationErrors, validateForm } = useFormValidation({ email, password }, false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm()
    if (!isValid) {
      return
    }

    try {
      await login(email, password);
      const element = document.getElementById('successModal') as HTMLElement;
      const successModal = new Modal(element);
      successModal.show()
      setTimeout(() => {
        successModal.hide()
        router.push('/post-list')
      }, 1500)
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      const element = document.getElementById('errorModal') as HTMLElement;
      const errerModal = new Modal(element);
      errerModal.show()
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
            <button type="submit" className="btn btn-yellow01 w-100 mt-4 mb-3">Login</button>
            <div className='text-center'>
              <Link href="/register" className='text-yellow01 fs-5 text m-auto'>Create an account</Link></div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <div className="modal fade" id="successModal" tabIndex={-1} aria-labelledby="successModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body d-flex flex-column align-items-center">
              <Image alt='' src='/successIcon.svg' width={40} height={40} className='m-4' />
              <p className='w-100 text-center mb-4'>Successfully login</p>
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