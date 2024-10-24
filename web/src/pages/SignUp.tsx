import { ErrorMessage, Field, Form, Formik } from "formik";

interface MyFormValues {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}

export default function SignUp(){
  const initialValues: MyFormValues = { name: '', email: '', password: '', confirmPassword: '' }
  const errors: MyFormValues = { name: '', email: '', password: '', confirmPassword: ''}

  return(
    <div>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          if (!values.name) {
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
          if (!values.confirmPassword){
            errors.confirmPassword = "Campo obrigatório";
          }
          return errors;
        }}

        onSubmit={(values, actions) => {

          actions.setSubmitting(false)
        }}
      >
          <Form>
            <div>
              <label htmlFor="name">Nome</label>
              <Field id="name" name="name" placeholder="Digite seu nome"></Field>
              <ErrorMessage name="name"></ErrorMessage>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" placeholder="Digite seu email"></Field>
              <ErrorMessage name="email"></ErrorMessage>
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <Field id="password" name="password" placeholder="Digite sua senha"></Field>
              <ErrorMessage name="password"></ErrorMessage>
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <Field id="confirmPassword" name="confirmPassword" placeholder="Confirmar Senha"></Field>
              <ErrorMessage name="confirmPassword"></ErrorMessage>
            </div>
            <button type="submit">Enviar</button>
          </Form>
      </Formik>
    </div>
  )
}