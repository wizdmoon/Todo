import React, { useState } from 'react'
import './Join.scss';
import useJoin from '../../../hooks/useJoin';
import {useNavigate } from 'react-router-dom';

function Join({onCancel}) {

  const {mutate: join, isPending} = useJoin({
    onSuccess: () => {
      alert('회원가입 성공');
      // navigate('/');
      onCancel();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const navigate = useNavigate();

  const [values, setValues] = useState({id: '', password: '', name: ''})

  const onChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
    };

  const canSubmit = values.id.trim() && values.password.trim() && values.name.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;
    join({id: values.id, password: values.password, name: values.name});
  };
  return (
    <div className='join-container'>
        <p>회원 가입</p>
        <form onSubmit={handleSubmit}>
            <input type="text" label="ID" name='id' value={values.id} onChange={onChange} placeholder='아이디'/>
            <input type="password" label="Password" name='password' value={values.password} onChange={onChange} placeholder='비밀번호'/>
            <input type="text" label='Name' name='name' value={values.name} onChange={onChange} placeholder='이름'/>
            <div>
                <button type='submit' className='submit-btn medium'>회원 가입</button>
                <button type='button' className='submit-btn outline medium' onClick={onCancel}>취소</button>
            </div>
        </form>
    </div>
  )
}

export default Join