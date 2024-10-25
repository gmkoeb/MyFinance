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
      <Form className="flex flex-col">
        <label className="font-semibold" htmlFor="name">Nome</label>
        <Field className="w-96 p-1 rounded" id="name" name="name" placeholder="Nome da empresa"/>
        <ErrorMessage className="text-red-500" name="name" component={'div'}></ErrorMessage>
        <button className="w-32 bg-green-500 rounded-md text-white mt-2" type="submit">Cadastrar</button>
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
