import { api } from '../../api/axios'
import { useNavigate } from "react-router-dom";
import AccountForm from '../components/AccountForm';
import { useState } from 'react';

export default function SignUp(){
  const navigate = useNavigate()
  const initialValues = { name: '', email: '', password: '', password_confirmation: '' }
  const [errors, setErrors] = useState([])

  async function handleSubmit(values: any, setSubmitting: (isSubmitting: boolean) => void ){
    await api.post('/users/sign_up', values).then(() => {
      setSubmitting(false);
      navigate('/sign_in');
    })
    .catch(error => {
      setErrors(error.response.data.error)
      setSubmitting(false);
    })
  }

  return <AccountForm initialValues={initialValues} submit={handleSubmit} isSignIn={false} apiErrors={errors}/>
}