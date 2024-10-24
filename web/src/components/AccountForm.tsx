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
          <Form>
            {!isSignIn && (
              <div>
                <label htmlFor="name">Nome</label>
                <Field id="name" name="name" type="text" placeholder="Digite seu nome"></Field>
                <ErrorMessage name="name" component={'div'}></ErrorMessage>
              </div>
            )}
            <div>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" placeholder="Digite seu email"></Field>
              <ErrorMessage name="email" component={'div'}></ErrorMessage>
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <Field id="password" name="password" type="password" placeholder="Digite sua senha"></Field>
              <ErrorMessage name="password" component={'div'}></ErrorMessage>
            </div>
              {!isSignIn && (
                <div>
                  <label htmlFor="password_confirmation">Confirmar Senha</label>
                  <Field id="password_confirmation" name="password_confirmation" type="password" placeholder="Confirmar Senha"></Field>
                  <ErrorMessage name="password_confirmation" component={'div'}></ErrorMessage>
                </div>
              )}
            <button type="submit">Enviar</button>
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