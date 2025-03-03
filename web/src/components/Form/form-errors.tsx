interface FormErrorsProps {
  apiErrors: string[]
}

export function FormErrors({ apiErrors }: FormErrorsProps) {
  return (
    <div>
      {apiErrors.length > 0 && (
        <div>
          {apiErrors.map(error => (
            <div
              className="flex flex-col gap-2 mt-10 border border-red-500 w-1/2 items-center rounded"
              key={error}
            >
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
