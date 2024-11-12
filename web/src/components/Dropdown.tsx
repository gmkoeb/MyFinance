import { Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface DropdownProps{
  buttons: string[],
  showDropdown: number,
  setClickedId: React.Dispatch<React.SetStateAction<number>>,
  setShowDropdown: React.Dispatch<React.SetStateAction<number>>,
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>,
  billId: number
}

export default function Dropdown( { buttons, showDropdown, setShowDropdown, billId, setShowEditForm, setClickedId }:DropdownProps ){
  function handleShowDropdown(event: React.MouseEvent<HTMLButtonElement>){
    setClickedId(Number(event.currentTarget.id))
    if (showDropdown !== -1){
      setShowDropdown(-1)
    } else {
      setShowEditForm(false)
      setShowDropdown(Number(event.currentTarget.id))
    } 
  }

  function handleShowEditForm(){
    setShowEditForm(true)
    setShowDropdown(-1)
  }

  useEffect(() => {
    if(showDropdown === -1){
      setShowDropdown(-1)
    }
  }, [showDropdown])

  return(
    <div className="relative text-left">
      <div className="relative">
        <button 
           onClick={(e) => handleShowDropdown(e)}
            type="button" 
            className="absolute justify-center gap-x-1.5 rounded-md text-sm font-semibold text-gray-900 left-14 mt-1 z-10" 
            id={`${billId}`}
            aria-expanded="true" 
            aria-haspopup="true">
            <Settings width={20}/>
        </button>
      </div>
      {showDropdown === billId &&
        <div className="absolute -left-5 z-10 mt-8 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
          <div className="py-1" role="none">
            {buttons.map(button => (
              <button 
                onClick={() => button === 'Editar' ? handleShowEditForm() : ''}
                key={button} 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 text-center w-full" role="menuitem" 
                tabIndex={-1}>
                  {button}
                </button>
            ))}
          </div>
        </div>
      }
    </div>
  )
}