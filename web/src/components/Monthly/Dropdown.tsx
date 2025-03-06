import { Settings } from 'lucide-react'
import { type ComponentProps, useEffect } from 'react'

interface DropdownProps extends ComponentProps<'div'> {
  showDropdown: number
  setShowDropdown: React.Dispatch<React.SetStateAction<number>>
  buttonFunction?: unknown
  billId: number
}

export default function Dropdown({
  showDropdown,
  setShowDropdown,
  billId,
  buttonFunction,
  ...props
}: DropdownProps) {
  function handleShowDropdown(event: React.MouseEvent<HTMLButtonElement>) {
    if (showDropdown !== -1) {
      setShowDropdown(-1)
    } else {
      setShowDropdown(Number(event.currentTarget.id))
    }
  }

  useEffect(() => {
    if (showDropdown === -1) {
      setShowDropdown(-1)
    }
  }, [showDropdown, setShowDropdown])

  return (
    <div className="relative text-left">
      <div className="relative">
        <button
          onClick={e => handleShowDropdown(e)}
          type="button"
          className="absolute justify-center gap-x-1.5 rounded-md text-sm font-semibold text-gray-900 left-14 mt-1 z-10"
          id={`${billId}`}
          aria-expanded="true"
          aria-haspopup="true"
        >
          <Settings width={20} />
        </button>
      </div>
      {showDropdown === billId && (
        <div
          className="absolute -left-5 z-10 mt-8 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="banner" {...props} />
        </div>
      )}
    </div>
  )
}
