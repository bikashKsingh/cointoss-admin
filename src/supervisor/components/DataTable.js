export default function DataTable(props) {
  const { headerGroups, getTableProps, rows, getTableBodyProps, prepareRow } =
    props;
  return (
    <table
      id="table-to-xls"
      {...getTableProps()}
      className="table table-bordered table-striped my-0"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {!column.disableSortBy
                    ? column.isSorted && true
                      ? column.isSortedDesc
                        ? " ▾"
                        : " ▴"
                      : "▴▾"
                    : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
