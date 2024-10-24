import { useNavigate } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import { api } from "../../api/axios";
import Cookies from 'js-cookie'
import { useState } from "react";

interface ApiResponse {
  token: {
    code: string
  },
  user: {
    name: string
  }
}

interface SignInProps {
  setIsSignedIn: (isSignedIn: boolean) => void;
}

export default function SignIn({ setIsSignedIn }: SignInProps){
  const navigate = useNavigate()
  const initialValues = { email: '', password: '' }
  const [errors, setErrors] = useState<string[]>([])

  async function handleSubmit(values: any, setSubmitting: (isSubmitting: boolean) => void ){
    try {
      const result = await api.post<ApiResponse>('/users/sign_in', values)
      Cookies.set('token', result.data.token.code)
      Cookies.set('currentUser', result.data.user.name)
      setIsSignedIn(true)
      setSubmitting(false);
      navigate('/')
      window.location.reload()
    } catch(error: any) {
      setErrors(error.response.data.message)
      setSubmitting(false);
    }
  }

  return <AccountForm initialValues={initialValues} submit={handleSubmit} isSignIn={true} apiErrors={errors} />
}