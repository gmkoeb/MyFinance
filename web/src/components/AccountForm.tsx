import { ErrorMessage, Field, Form, Formik } from "formik";

interface MyFormValues {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

interface AuthFormProps {
  initialValues: MyFormValues;
  submit: (values: { user: MyFormValues }, setSubmitting: (isSubmitting: boolean) => void) => void;
  isSignIn?: boolean;
  apiErrors: string[];
}

export default function AccountForm({ initialValues, submit, isSignIn, apiErrors }: AuthFormProps ){
  return(
    <div>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<MyFormValues> = {}

          if (!values.name && !isSignIn) {
            errors.name = "Campo obrigatório";
          }
          
          if (!values.email) {
            errors.email = "Campo obrigatório";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Email inválido";
          }
          if (!values.password) {
            errors.password = "Campo obrigatório";
          }
          if (!values.password_confirmation && !isSignIn){
            errors.password_confirmation = "Campo obrigatório";
          }
          return errors;
        }}

        onSubmit={(values, actions) => {
          const userPayload = { user: values };
          submit(userPayload, actions.setSubmitting);
        }}
        
        > 
          <Form className="flex flex-col items-center bg-white w-fit p-5 rounded-lg border border-neutral-400 mx-auto justify-center gap-4">
            {isSignIn ?(
              <><h2 className="text-xl font-bold text-blue-500">Entrar</h2></>
            ): (
              <><h2 className="text-xl font-bold text-blue-500">Crie sua conta</h2></>
            )}
            {!isSignIn && (
              <div className="flex flex-col">
                <label className="font-semibold" htmlFor="name">Nome</label>
                <Field className="w-96 rounded-md p-1 border border-black" id="name" name="name" type="text" placeholder="Digite seu nome"></Field>
                <ErrorMessage className="text-red-500" name="name" component={'div'}></ErrorMessage>
              </div>
            )}
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="email">Email</label>
              <Field className="w-96 rounded-md p-1 border border-black" id="email" name="email" type="email" placeholder="Digite seu email"></Field>
              <ErrorMessage className="text-red-500" name="email" component={'div'}></ErrorMessage>
            </div>  
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="password">Senha</label>
              <Field className="w-96 rounded-md p-1 border border-black" id="password" name="password" type="password" placeholder="Digite sua senha"></Field>
              <ErrorMessage className="text-red-500" name="password" component={'div'}></ErrorMessage>
            </div>
              {!isSignIn && (
                <div className="flex flex-col">
                  <label className="font-semibold" htmlFor="password_confirmation">Confirmar Senha</label>
                  <Field className="w-96 rounded-md p-1 border border-black" id="password_confirmation" name="password_confirmation" type="password" placeholder="Confirmar Senha"></Field>
                  <ErrorMessage className="text-red-500" name="password_confirmation" component={'div'}></ErrorMessage>
                </div>
              )}
            <button className="mt-2 border bg-blue-500 rounded-lg p-1 px-4 text-white hover:opacity-80 duration-300" type="submit">Enviar</button>
            {apiErrors.length > 0 &&
              <div className="flex flex-col">
                {apiErrors.map(error => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            }
          </Form>
      </Formik>
    </div>
)}