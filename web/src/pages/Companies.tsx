import { PenBox, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../api/axios'
import type { Company } from './Home'
import { BRL } from '../lib/formatToBRL'
import PageHeader from '../components/PageHeader'

interface CompanyDetails extends Company {
  total_value: number
  bills_count: number
}

export default function Companies() {
  const [companies, setCompanies] = useState<CompanyDetails[]>([])
  const [editName, setEditName] = useState<number>(-1)
  const [name, setName] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])
  const [change, setChange] = useState<boolean>(false)

  async function handleUpdateCompany(companyId: number) {
    try {
      const companyData = {
        company: {
          name: name,
        },
      }
      await api.patch(`/companies/${companyId}`, companyData)
      setChange(true)
      setEditName(-1)
      setErrors([])
    } catch (error: any) {
      setErrors(error.response.data.message)
    }
  }

  function handleOpenEdit(companyId: number) {
    setErrors([])
    if (editName === -1) {
      setEditName(companyId)
    } else setEditName(-1)
  }

  async function handleCompanyDeletion(companyId: number) {
    try {
      await api.delete(`/companies/${companyId}`)
      setChange(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getCompanies() {
      try {
        const result = await api.get('/companies')
        setCompanies(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    getCompanies()
  }, [change])

  return (
    <div>
      <PageHeader title='Minhas Empresas'/>
      {companies.length > 0 ? (
        <>
          <h2 className="w-[75%] mx-auto text-2xl mt-5 font-semibold">
            Dados cadastrados
          </h2>
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
                      <div className="mx-auto">
                        <div className="flex gap-2 items-center">
                          <input
                            onChange={e => setName(e.target.value)}
                            className="border w-full rounded px-2 py-1"
                            type="text"
                            placeholder="Digite um novo nome"
                          />
                          <button
                            onClick={() => handleUpdateCompany(company.id)}
                            type="submit"
                            className="border p-1 px-3 rounded-lg bg-blue-500 text-white hover:opacity-80 duration-300"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditName(-1)}
                            className="hover:bg-red-500 px-1 py-[1px] rounded-lg hover:text-white duration-300"
                          >
                            Cancelar
                          </button>
                        </div>
                        {errors.length > 0 && (
                          <div>
                            {errors.map(error => (
                              <p key={error} className="text-red-500">
                                {error}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="w-full">{company.name}</p>
                    )}
                    <PenBox
                      onClick={() => handleOpenEdit(company.id)}
                      className="hover:cursor-pointer"
                    />
                  </td>
                  <td>{company.bills_count}</td>
                  <td>
                    {BRL.format(company.total_value)}
                  </td>
                  <td
                    onKeyDown={() => handleCompanyDeletion(company.id)}
                    onClick={() => handleCompanyDeletion(company.id)}
                    className="w-10"
                  >
                    <Trash2 color="red" className="hover:cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1 className="text-center">
          Você não possui nenhuma empresa cadastrada
        </h1>
      )}
    </div>
  )
}
