import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

interface CompanyFormProps {
  handleSubmit: (values: { name: string }, actions: FormikHelpers<{ name: string }>) => void,
  errors: string[]
}

interface CompanyFormValues{
  name: string
}

export default function CompanyForm({ handleSubmit, errors }: CompanyFormProps){
  return(
    <Formik
      initialValues={{ name: '' }}
      validate={(values) => {
        const errors: Partial<CompanyFormValues> = {}
        if (!values.name) {
          errors.name = "Campo obrigatório";
        }
        return errors
      }} 
      onSubmit={(values, actions) => {
        handleSubmit(values, actions)
      }}
      >
      <Form>
        <label htmlFor="name">Nome</label>
        <Field id="name" name="name" placeholder="Nome da empresa"/>
        <ErrorMessage name="name" component={'div'}></ErrorMessage>
        <button type="submit">Enviar</button>
        {errors &&
          (
            <div>
              {errors.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )
        }
      </Form>
    </Formik>
  )
}
