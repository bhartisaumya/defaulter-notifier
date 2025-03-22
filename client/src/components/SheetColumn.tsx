
const SheetHeader = ({columnNames}: {columnNames: string[]}) => {
  return (
    <>
        <tr>
            {columnNames.map((name, index) => (
                <th key={index} className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {name}
                </th>
            ))}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Action
            </th>
        </tr>
    </>
  )
}


const SheetRow = (props: any) => {
  const {dataFields, data, handleEdit} = props
  return(
    <>
      <tr key={data.id}>
        {dataFields.map((key: string, index: number) => (
          <td key={index} className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider">
            {data[key]}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button onClick={() => handleEdit(data)} className="text-blue-600 hover:text-blue-900 mr-4">
            Edit
          </button>
        </td>
      </tr>
    </>
  )
}


export{
  SheetHeader,
  SheetRow
}
