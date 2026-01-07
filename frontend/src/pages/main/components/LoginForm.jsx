import React from 'react'
import { useState } from 'react';
import useSignIn from '../../../hooks/useSignIn';
import { Navigate, useNavigate } from 'react-router-dom';
import './LoginForm.scss';

export default function LoginForm() {
    
    const { mutate: signIn, isPending } = useSignIn({
        onSuccess: () => {
            alert('로그인 성공!');
            navigate('/dashboard');
        },
        onError: (error) => {
            alert(error);
        },
    });
            
    const [values, setValues] = useState({ id: '', password: '' });

    const navigate = useNavigate();

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
    };
    const canSubmit = values.id.trim() && values.password.trim();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit || isPending) return;
        signIn({ id: values.id, password: values.password });
    };


  return (
    <div className='login-container'>
        <form onSubmit={handleSubmit}>
            <input type="text" className='id' label="ID" name="id" value={values.id} onChange={onChange} />
            <input type="password" className='password' label="Password" name="password" value={values.password} onChange={onChange} />
            <button type='submit' className='submit-btn small'>로그인</button>
        </form>
        <p>
            회원가입
        </p>
    </div>
  )
}