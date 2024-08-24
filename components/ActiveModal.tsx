'use client';
import React, { useEffect } from 'react'
import { Modal } from "bootstrap";

const ActiveModal = () => {
  useEffect(() => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => new Modal(modalEl));
  }, []);

  return null
}

export default ActiveModal