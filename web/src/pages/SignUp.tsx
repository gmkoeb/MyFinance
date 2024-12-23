import { api } from '../../api/axios'
import { useNavigate } from "react-router-dom";
import AccountForm from '../components/AccountForm';
import { useState } from 'react';

interface ApiResponse {
  user: {
    email: string,
    name: string
  }
}

export default function SignUp(){
  const navigate = useNavigate()
  const initialValues = { name: '', email: '', password: '', password_confirmation: '' }
  const [errors, setErrors] = useState<string[]>([])

  async function handleSubmit(values: any, setSubmitting: (isSubmitting: boolean) => void ){
    try{
      await api.post<ApiResponse>('/users/sign_up', values)
      setSubmitting(false);
      navigate('/sign_in');
    } catch(error: any){
      setErrors(error.response.data.message)
      setSubmitting(false);
    }
  }

  return <AccountForm initialValues={initialValues} submit={handleSubmit} isSignIn={false} apiErrors={errors}/>
}