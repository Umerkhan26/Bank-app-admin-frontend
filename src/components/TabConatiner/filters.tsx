import React from "react";
import { Input } from "reactstrap";
import { ColumnInstance, Row } from "react-table";

// For Filter wrapper component
interface FilterProps<T extends object> {
  column: ColumnInstance<T>;
}

export const Filter = <T extends object>({ column }: FilterProps<T>) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render("Filter")}
    </div>
  );
};

// For Default input filter
interface DefaultColumnFilterProps<T extends object> {
  column: {
    filterValue: any;
    setFilter: (value: any) => void;
    preFilteredRows: Row<T>[];
  };
}

export const DefaultColumnFilter = <T extends object>({
  column: { filterValue, setFilter, preFilteredRows },
}: DefaultColumnFilterProps<T>) => {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${preFilteredRows.length}) ...`}
    />
  );
};

// For select dropdown filter
interface SelectColumnFilterProps<T extends object> {
  column: {
    filterValue: any;
    setFilter: (value: any) => void;
    preFilteredRows: Row<T>[];
    id: string;
  };
}

export const SelectColumnFilter = <T extends object>({
  column: { filterValue, setFilter, preFilteredRows, id },
}: SelectColumnFilterProps<T>) => {
  const options = React.useMemo(() => {
    const opts = new Set<string>();
    preFilteredRows.forEach((row) => {
      opts.add(row.values[id]);
    });
    return [...opts.values()];
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
