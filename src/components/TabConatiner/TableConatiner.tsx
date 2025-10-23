import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  Column as ReactTableColumn,
  Row as ReactTableRow,
} from "react-table";
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  ColumnInstance,
  UseFiltersColumnProps,
  UseSortByColumnProps,
} from "react-table";

type EnhancedColumn<T extends object> = ColumnInstance<T> &
  UseFiltersColumnProps<T> &
  UseSortByColumnProps<T>;

// Types
interface Pagination {
  currentPage: number;
  totalPages: number;
  footerText?: string;
  totalItems: number;
  pageSize: number;
}

type FilterableColumn<T extends object> = EnhancedColumn<T>;

interface TableContainerProps<T extends object> {
  columns: ReactTableColumn<T>[];
  data: T[];
  isPagination?: boolean;
  iscustomPageSize?: boolean;
  className?: string;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showHeaderFilters?: boolean;
  page?: number;
  tableStyle?: React.CSSProperties; // Added tableStyle prop
  rowProps?: (
    row: ReactTableRow<T>
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  footerText?: string;
}

// Filter Components
export const Filter = <T extends object>({
  column,
}: {
  column: FilterableColumn<T>;
}) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render("Filter")}
    </div>
  );
};

export const DefaultColumnFilter: React.FC<{
  column: {
    filterValue: string | undefined;
    setFilter: (value: string | undefined) => void;
    preFilteredRows: ReactTableRow<object>[];
    id: string;
  };
}> = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${length}) ...`}
    />
  );
};

export const SelectColumnFilter: React.FC<{
  column: {
    filterValue: string | undefined;
    setFilter: (value: string | undefined) => void;
    preFilteredRows: ReactTableRow<object>[];
    id: string;
  };
}> = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = React.useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      id="custom-select"
      className="form-select"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// Main TableContainer Component
const TableContainer = <T extends object>({
  columns,
  data,
  isPagination = false,
  className = "",
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  },
  onPageChange = () => {},
  onPageSizeChange = () => {},
  showHeaderFilters = false,
  tableStyle,
  footerText,
}: TableContainerProps<T>) => {
  // Notice the generic <T> here with plugins used
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>(
      {
        columns,
        data,
        defaultColumn: { Filter: DefaultColumnFilter } as Partial<
          EnhancedColumn<T>
        >,
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      useExpanded
    );

  const generateSortingIndicator = (column: EnhancedColumn<T>) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const page = value && !isNaN(Number(value)) ? Number(value) : 1;
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange(page);
    }
  };

  const customButtonStyle = {
    backgroundColor: "#1a8797",
    borderColor: "#1a8797",
  };

  const [pageSizeDropdownOpen, setPageSizeDropdownOpen] = useState(false);
  const togglePageSizeDropdown = () => setPageSizeDropdownOpen((prev) => !prev);

  const pageSizes = [10, 25, 50, 100];

  return (
    <Fragment>
      <div
        className="table-responsive"
        style={{ width: "100%", overflowX: "auto", minWidth: "100%" }}
      >
        <Table
          bordered
          hover
          {...getTableProps()}
          className={className}
          style={{
            width: "100%",
            tableLayout: "fixed",
            margin: 0,
            padding: 0,
            minWidth: "100%",
            ...tableStyle,
          }}
        >
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  // No cast here needed — TypeScript infers correctly
                  const enhancedColumn = column as unknown as EnhancedColumn<T>;

                  return (
                    <th
                      key={enhancedColumn.id}
                      style={{
                        fontSize: "0.725rem",
                        fontWeight: "bold",
                        padding: "8px",
                        width: enhancedColumn.width || "auto",
                      }}
                    >
                      <div
                        className="mb-2"
                        {...enhancedColumn.getSortByToggleProps()}
                        style={{ padding: "0.1rem 0.1rem" }}
                      >
                        {enhancedColumn.render("Header")}
                        {generateSortingIndicator(enhancedColumn)}
                      </div>
                      {showHeaderFilters && (
                        // Cast only here, where Filter expects EnhancedColumn<T>
                        <Filter column={enhancedColumn} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "0.4rem 0.4rem",
                        whiteSpace: "nowrap",
                        fontSize: "0.825rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row
          className="justify-content-md-end justify-content-center align-items-center mt-3"
          style={{ width: "100%" }}
        >
          <Col md={3} className="d-flex align-items-center">
            <span className="me-2">Show:</span>
            <Dropdown
              isOpen={pageSizeDropdownOpen}
              toggle={togglePageSizeDropdown}
            >
              <DropdownToggle caret color="light" className="py-1 px-2">
                {pagination.pageSize}
              </DropdownToggle>
              <DropdownMenu>
                {pageSizes.map((size) => (
                  <DropdownItem
                    key={size}
                    active={pagination.pageSize === size}
                    onClick={() => {
                      onPageSizeChange(size);
                      onPageChange(1);
                    }}
                  >
                    {size}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <span className="ms-2">entries</span>
          </Col>

          <Col md={6} className="d-flex justify-content-center">
            <div className="d-flex align-items-center gap-2">
              <Button
                style={customButtonStyle}
                onClick={() => onPageChange(1)}
                disabled={pagination.currentPage === 1}
                size="sm"
              >
                {"<<"}
              </Button>
              <Button
                style={customButtonStyle}
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                size="sm"
              >
                {"<"}
              </Button>
              <div className="mx-2 d-flex align-items-center">
                <span className="me-2">Page</span>
                <Input
                  type="number"
                  min={1}
                  max={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={onChangeInInput}
                  style={{ width: "60px" }}
                  bsSize="sm"
                />
                <span className="ms-2">of {pagination.totalPages}</span>
              </div>
              <Button
                style={customButtonStyle}
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                size="sm"
              >
                {">"}
              </Button>
              <Button
                style={customButtonStyle}
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                size="sm"
              >
                {">>"}
              </Button>
            </div>
          </Col>
          <Col md={3} className="text-md-end">
            <span style={{ fontSize: "14px", fontWeight: "500 " }}>
              Total: {pagination.totalItems} items
            </span>
          </Col>

          {/* <Col md={3} className="text-md-end">
            <span style={{ fontSize: "14px" }}>
              Total: {pagination.footerText} R
            </span>
          </Col> */}
          {/* {footerText && (
            <div style={{ marginTop: "10px", fontSize: "0.85rem" }}>
              {footerText}
            </div>
          )} */}

          <Col md={3} className="text-md-end">
            <div style={{ fontSize: "14px", fontWeight: "500 " }}>
              {footerText && <span>{footerText}</span>}
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isPagination: PropTypes.bool,
  iscustomPageSize: PropTypes.bool,
  className: PropTypes.string,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }),
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  showHeaderFilters: PropTypes.bool,
  tableStyle: PropTypes.object,
};

export default TableContainer;
