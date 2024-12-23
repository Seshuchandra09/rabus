import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Column {
  field: string;
  headerName: string;
  width: number;
}

interface DataTableProps {
  rows: any[];
  columns: Column[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ rows, columns, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} style={{ width: column.width }}>
                {column.headerName}
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column.field}`}>
                  {row[column.field]}
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={() => onEdit(row.id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(row.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;