import { useSelection } from "@/hooks/use-selection";
import { Box, Button, Card, Checkbox, Divider, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import React from "react";
import dayjs from 'dayjs';

function noop(): void {
    // do nothing
  }
export interface Customer {
    _id: string;
    name: string;
    description: string;
    createdAt: Date;
  }
  
  interface CustomersTableProps {
    count?: number;
    page?: number;
    rows?: Customer[];
    rowsPerPage?: number;
    onUpdate: (_id: string) => void;  // Callback for the Update action
    onDelete: (id: string) => void;
  }
export function CategroyTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onUpdate,
  onDelete,
}: CustomersTableProps): React.JSX.Element {
    const rowIds = React.useMemo(() => {
        return rows.map((customer) => customer._id);
      }, [rows]);
    
      const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
    
      const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
      const selectedAll = rows.length > 0 && selected?.size === rows.length;
    return(
        <>
         <Card>
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAll}
                          indeterminate={selectedSome}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selectAll();
                            } else {
                              deselectAll();
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Current Date</TableCell>
                      <TableCell>Action</TableCell>
        
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const isSelected = selected?.has(row._id);
        
                      return (
                        <TableRow hover key={row._id} selected={isSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  selectOne(row._id);
                                } else {
                                  deselectOne(row._id);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                              {/* <Avatar src={row.avatar} /> */}
                              <Typography variant="subtitle2">{row?.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row?.description}</TableCell>
                          <TableCell>{dayjs(row?.createdAt).format('MMM D, YYYY')}</TableCell>
                          <TableCell>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small" 
                              sx={{ mr: 1 }}
                              onClick={() => onUpdate(row._id)} // Update button
                            >
                              Update
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small" 
                              onClick={() => onDelete(row._id)} // Delete button
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              <Divider />
              <TablePagination
                component="div"
                count={count}
                onPageChange={noop}
                onRowsPerPageChange={noop}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
        </>
    )
}