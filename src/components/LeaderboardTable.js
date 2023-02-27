import React from "react";
import { useTable, useSortBy } from "react-table";

import LeaderboardHandle from "./LeaderboardHandle";

const LeaderboardTable = ({ results, isLoading, reduced }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (props) => {
          return <p>{props.flatRows.indexOf(props.row) + 1}</p>;
        },
      },
      {
        Header: "Competitor",
        Cell: (props) => (
          <LeaderboardHandle
            handle={props.row.original.handle}
            image={props.row.original.image}
            link={props.row.original.link}
            members={props.row.original.members}
          />
        ),
      },
      {
        Header: "USD",
        accessor: "awardTotal",
        sortDescFirst: true,
        className: "table__cell--number",
        Cell: (props) => {
          return (
            <span className="award-amount">
              {props.value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          );
        },
      },
      {
        Header: "Total",
        accessor: "allFindings",
        sortDescFirst: true,
        className: "table__cell--number",
      },
      {
        Header: "High",
        columns: [
          {
            Header: "All",
            accessor: "highRisk",
            sortDescFirst: true,
            className: "table__cell--number",
          },
          {
            Header: "Solo",
            accessor: "soloHigh",
            sortDescFirst: true,
            className: "table__cell--number",
          },
        ],
      },
      {
        Header: "Med",
        columns: [
          {
            Header: "All",
            accessor: "medRisk",
            sortDescFirst: true,
            className: "table__cell--number",
          },
          {
            Header: "Solo",
            accessor: "soloMed",
            sortDescFirst: true,
            className: "table__cell--number",
          },
        ],
      },
      {
        Header: "Gas",
        columns: [
          {
            Header: "All",
            accessor: "gasOptz",
            sortDescFirst: true,
            className: "table__cell--number",
          },
        ],
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: results,
      initialState: {
        sortBy: [
          {
            id: "awardTotal",
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );

  return (
    <table {...getTableProps()} className="leaderboard-table table--zebra">
      {/* TODO: put className in tableProps properly */}
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted
                    ? column.isSortedDesc
                      ? "sort-desc"
                      : "sort-asc"
                    : "" + (column.isNumber ? " table__column--numbers" : "")
                }
              >
                {column.render("Header")}
                <span className="sort-direction">
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {rows.length > 0 && !isLoading ? (
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                      },
                    ])}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      ) : !isLoading ? (
        <tbody>
          {/* TODO - finish animating this */}
          <tr>
            <td colSpan="9" className="center">
              <h3 className="skeleton-loader">Fetching results...</h3>
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan="9" className="center">
              No results to show. Try changing filter criteria
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

export default LeaderboardTable;
