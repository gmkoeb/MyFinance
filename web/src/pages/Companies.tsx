import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { Company } from "./Home";
import { PenBox, Trash2 } from "lucide-react";

interface CompanyDetails extends Company{
  total_value: number,
  bills_count: number
}

export default function Companies(){
  const [companies, setCompanies] = useState<CompanyDetails[]>([])
  const [editName, setEditName] = useState<number>(-1)
  const [name, setName] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])
  const [change, setChange] = useState<boolean>(false)

  async function getCompanies(){
    try {
      const result = await api.get("/companies")
      setCompanies(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdateCompany(companyId: number){
    try {
      const companyData = {
        company: {
          name: name
        }}
      await api.patch(`/companies/${companyId}`, companyData)
      setChange(true)
      setEditName(-1)
      setErrors([])
    } catch (error: any){
      setErrors(error.response.data.message)
    }
  }

  function handleOpenEdit(companyId: number){
    setErrors([])
    if (editName === -1){
      setEditName(companyId)
    } else (
      setEditName(-1)
    )
  }

  async function handleCompanyDeletion(companyId: number){
    try {
      await api.delete(`/companies/${companyId}`)
      setChange(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [change])

  return(
    <div>
      <h1 className="text-center mb-10 text-4xl">Minhas Empresas</h1>
      {companies.length > 0 ? (
        <table className="company-table-container w-[75%] mx-auto">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contas Pagas</th>
              <th>Valor Total Pago</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr className="company-row" key={company.id}>
                <td className="flex items-center w-full justify-between">
                  {editName === company.id ? (
                    <div className="w-1/2 mx-auto">
                      <div className="flex gap-2 items-center">
                        <input onChange={(e) => setName(e.target.value)} className="border w-full rounded-lg px-2" type="text" placeholder="Digite um novo nome"/>
                        <button onClick={() => handleUpdateCompany(company.id)} type="submit" className="border px-4 rounded-lg bg-blue-500 text-white">Editar</button>
                        <button onClick={() => setEditName(-1)} className="hover:bg-red-500 px-1 py-[1px] rounded-lg hover:text-white duration-300">Cancelar</button>
                      </div>
                      {errors.length > 0 && 
                        <>
                          {errors.map(error => (
                            <p key={error} className="text-red-500">{error}</p>
                          ))}
                        </>
                      }
                    </div>
                  ) : (
                    <p className="w-full">{company.name}</p>
                  )}
                  <PenBox onClick={() => handleOpenEdit(company.id)} className="hover:cursor-pointer">
                  </PenBox>
                </td>
                <td>{company.bills_count}</td>
                <td>R$ {company.total_value}</td>
                <td onClick={() => handleCompanyDeletion(company.id)} className="w-10"><Trash2 color="red" className="hover:cursor-pointer"></Trash2></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="text-center">Você não possui nenhuma empresa cadastrada</h1>
      )}
    </div>
  )
}