import { HandCoins } from "lucide-react";
import BillForm from "../components/BillForm";
import { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import { api } from "../../api/axios";
import { Bill, Company } from "./Home";
import Dropdown from "../components/Dropdown";
import EditBillForm from "../components/EditBillForm";

export default function Monthly(){
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(-1)
  const [monthlyBillOpen, setMonthlyBillOpen] = useState<boolean>(false)
  const [change, setChange] = useState<boolean>(false)
  const [billErrors, setBillErrors] = useState<string[]>([])
  const [companies, setCompanies] = useState<Company[]>([]);
  const [monthlyBills ,setMonthlyBills] = useState<Bill[]>([])
  const [billValue, setBillValue] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<number>(-1)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [clickedId, setClickedId] = useState<number>(-1)
  const buttons = ['Editar', 'Remover']

  useEffect(() => {
    setSelectedCompanyId(-1)
  }, [monthlyBillOpen])

  useEffect(() => {
    getCompanies();
    setChange(false)

    if (billErrors.length > 0) {
      setBillErrors([])
    }

    if (showEdit){
      setShowEdit(false)
    }

    if (showDropdown !== -1){
      setShowDropdown(-1)
    }

  }, [change]); 
  
  async function payMonthlyBill(companyId: number, bill: Partial<Bill>){
    if (billValue) {
      try {
        const billData = { bill: {
            name: bill.name,
            billing_company: bill.billing_company,
            value: billValue,
            paid: true
          }
        }
        api.post(`/companies/${companyId}/create_bill`, billData)
        setChange(true)
      } catch (error: any) {
        setBillErrors(error.response.data.message)
      }
    }
  }

  async function getMonthlyBills(companies: Company[]){
    const result = await Promise.all(companies.map(company => api.get(`/companies/${company.id}/monthly_bills`)));
    const monthlyBills = result.map(response => response.data);
    const flattenedBills = monthlyBills.flat();
    setMonthlyBills(flattenedBills)
  }

  async function createMonthlyBill(companyId: number, values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>){
    try{
      const monthlyBillData = { 
        monthly_bill: {
          name: values.billName,
          billing_company: values.billing_company,
          payment_date: values.payment_date,
          value: 0
      }}

      await api.post(`/companies/${companyId}/monthly_bills`, monthlyBillData)
      actions.setSubmitting(false)
      setChange(true)
      actions.resetForm()
    } catch(error: any){
      actions.setSubmitting(false)
      setBillErrors(error.response.data.message)
    }
  }

  async function handleBillUpdate(monthlyBillId: number, values: Partial<Bill>, actions: FormikHelpers<Partial<Bill>>){
    try {
      const monthlyBillData = { 
        monthly_bill: {
          name: values.billName,
          billing_company: values.billing_company,
          payment_date: values.payment_date,
          value: values.value
      }}
      api.patch(`/monthly_bills/${monthlyBillId}`, monthlyBillData)
      actions.setSubmitting(false)
      setChange(true)   
    } catch (error: any) {
      actions.setSubmitting(false)
      setBillErrors(error.response.data.message)
    }
  }

  async function getCompanies(){
    const result = await api.get('/companies')
    setCompanies(result.data)
    getMonthlyBills(result.data)
  }

  async function handleDeleteMonthlyBill(billId: number){
    try {
      await api.delete(`/monthly_bills/${billId}`)
      setChange(true)
    } catch (error) {
      console.log(error)      
    }
  }

  return(
    <div className="flex flex-col items-center mb-20">
      <button 
      onClick={() => monthlyBillOpen ? setMonthlyBillOpen(false) : setMonthlyBillOpen(true)}
      className="text-xl items-center border border-black p-3 font-bold bg-blue-500 text-white rounded-full hover:opacity-80 duration-300 w-96 flex justify-center gap-3">
        <p>Adicionar mensalidade</p>
        <HandCoins />
      </button>
      {monthlyBillOpen && (
        <>
          <select className="border rounded-lg w-96 text-center my-5" onChange={(e) => setSelectedCompanyId(Number(e.target.value))}>
              <option value={-1}>Selecione uma empresa</option>
            {companies.map(company => (
              <option value={company.id} key={company.id}>{company.name}</option>
            ))}
          </select>
          {selectedCompanyId !== -1 && (
            <div>
              <BillForm 
                isMonthly={true}
                company_id={selectedCompanyId} 
                handleSubmit={(values, actions) => createMonthlyBill(selectedCompanyId, values, actions)} 
                errors={billErrors}
                setSelectedCompanyId={setSelectedCompanyId}
              />
            </div>
          )}
        </>
      )}
      <div className="w-full border-t border-black my-5"></div>
      <h1 className="text-4xl text-center border font-bold border-black w-1/2 bg-white py-1 rounded-t-lg">Mensalidades</h1>
      {companies.map(company => {
        const filteredBills = monthlyBills.filter(bill => company.id === bill.company_id)
        return filteredBills.length > 0 ? (
          <div key={company.id} className="flex flex-col w-1/2 items-center border-x border-b border-black bg-white">
            <h1 className="text-3xl">{company.name}</h1>
            <div className="flex flex-wrap gap-2 my-5 justify-center">
              {filteredBills.map(bill => (
                <div key={bill.id} className={
                    bill.paid ? 
                    "flex flex-col border gap-1 items-center border-black rounded-lg w-40 h-fit justify-center text-center bg-slate-100" : 
                    "flex flex-col gap-1 items-center border border-black rounded-lg bg-white w-40 h-fit justify-center text-center"}
                  >
                  <div>
                    <Dropdown 
                      setShowEditForm={setShowEdit} 
                      showDropdown={showDropdown} 
                      buttons={buttons} 
                      setClickedId={setClickedId}
                      setShowDropdown={setShowDropdown} 
                      billId={bill.id} 
                      handleDeleteMonthlyBill={handleDeleteMonthlyBill}
                    />
                  </div>
                    {showEdit && clickedId === bill.id && (
                      <EditBillForm 
                        setShowEdit={setShowEdit} 
                        bill={bill} 
                        bill_id={bill.id} 
                        errors={billErrors} 
                        handleSubmit={handleBillUpdate}
                        isMonthly={true}
                      />
                    )}
                    <div className="w-full">
                      <div className={bill.paid ? "opacity-45" : ""}>
                        <h3 className="text-center text-md font-bold">{bill.name}</h3>
                        <p>{bill.billing_company}</p>
                        {bill.paid && 
                          <p>{bill.value}</p>
                        }
                      </div>
                      {bill.paid ? (
                        <div className="w-full">
                          <button 
                            disabled
                            onClick={() => payMonthlyBill(company.id, bill)} 
                            className="bg-slate-500 mt-[7px] p-1 rounded-b-lg text-sm w-full text-white">
                              Pago
                          </button>
                        </div>
                      ):(
                        <div className="w-full">
                          <input 
                            className="w-28 mb-1 border border-black rounded-lg text-center invalid:Field" 
                            placeholder="Valor" 
                            type="text"
                            required
                            onChange={(e) => setBillValue(e.target.value)}
                          >
                          </input>  
                          <button 
                            type="submit"
                            onClick={() => payMonthlyBill(company.id, bill)}
                            className="bg-green-600 p-1 rounded-b-lg text-sm w-full hover:opacity-90 duration-300 text-white">
                              Pagar
                          </button>
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div key={company.id} className="flex flex-col w-1/2 items-center border-x border-b border-black bg-white">
            <h1 className="text-3xl">{company.name}</h1>
            <h2>Empresa ainda não possui mensalidades cadastradas</h2>
          </div>
        )
    })}
    </div>
  )
}