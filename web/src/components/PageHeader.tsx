interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }:PageHeaderProps){
  return <h1 className="w-full text-left pl-10 bg-neutral-100 h-20 text-4xl font-bold items-center flex border-b border-neutral-300 text-neutral-600"> {title} </h1>
}