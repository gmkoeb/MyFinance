import { ErrorMessage, Field } from 'formik'
import type { ComponentProps } from 'react'

interface FormInputProps extends ComponentProps<'input'> {
  inputLabel: string
  name: string
}
export function FormInput({ inputLabel, name, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col">
      <label className="ml-1" htmlFor={props.id}>
        {inputLabel}
      </label>
      <Field name={name} type={props.type} {...props} />
      <ErrorMessage className="text-red-500" name={name} component={'div'} />
    </div>
  )
}
