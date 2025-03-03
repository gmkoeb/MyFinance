import { Form, type FormikFormProps } from 'formik'
import { FormErrors } from './form-errors'

interface FormRootProps extends FormikFormProps {
  apiErrors: string[]
}

export function FormRoot({ apiErrors, ...props }: FormRootProps) {
  return (
    <Form {...props}>
      {props.children}
      <FormErrors apiErrors={apiErrors} />
    </Form>
  )
}
