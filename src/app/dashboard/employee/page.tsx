'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { Customer } from '@/components/dashboard/customer/customers-table';

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [open, setOpen] = React.useState(false); 
  const [upopen, setupOpen] = React.useState(false);
  const [employeeName, setEmployeeName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [idProof, setIdProof] = React.useState<File | null>(null); // For file input
  const [photo, setPhoto] = React.useState<File | null>(null); // For file input
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [salary, setSalary] = React.useState('');
  const [joiningDate, setJoiningDate] = React.useState('');
  const [employee, setEmployee] = React.useState<Customer[]>([]);
  const [editCategoryId, setEditCategoryId] = React.useState<string | null>(null); // Track the category ID to edit
  const [uploadedIdProof, setUploadedIdProof] = React.useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = React.useState<string | null>(null);

  const paginatedCustomers = applyPagination(employee, page, rowsPerPage);

  // Fetch categories
  const getEmployee = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/allemployee');
      if (response.status === 200) {
        setEmployee(response.data.employee);
      }
    } catch (error: any) {
      console.error('Error fetching employee:', error.message);
    }
  };

  React.useEffect(() => {
    getEmployee();
  }, []);
  // Handle form submit for adding new employee
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', employeeName);
    formData.append('address', address);
    formData.append('phone', phoneNumber);
    formData.append('position', position);
    formData.append('salary', salary);
    formData.append('joiningDate', joiningDate);
    if (idProof) {
      formData.append('idProof', idProof); // idProof field
    }
    if (photo) {
      formData.append('photo', photo); // photo field
    }
    try {
      const response = await axios.post('http://localhost:5000/api/employee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        console.log("Employee added successfully!");
          setupOpen(false);
          setEmployeeName('');
          setAddress('');
          setPhoneNumber('');
          setIdProof(null);
          setPhoto(null);
          setPosition('');
          setSalary('');
          setJoiningDate('');
      } else {
        throw new Error("Failed to add employee");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setEmployeeName('');
    setAddress('');
    setPhoneNumber('');
    setIdProof(null);
    setPhoto(null);
    setPosition('');
    setSalary('');
    setJoiningDate('');
    setupOpen(true); // Open Add dialog
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employee</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenAddDialog}>
            Add
          </Button>
        </div>
      </Stack>
      <CustomersTable
              count={paginatedCustomers.length}
              page={page}
              rows={employee}
              rowsPerPage={rowsPerPage} onUpdate={function (_id: string): void {
                  throw new Error('Function not implemented.');
              } } onDelete={function (id: string): void {
                  throw new Error('Function not implemented.');
              } }      />
      {/* Dialog for Add Employee */}
      <Dialog open={upopen} onClose={() => setupOpen(false)}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="employee-name"
            label="Employee Name"
            type="text"
            fullWidth
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="phone-number"
            label="Phone Number"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="position"
            label="Position"
            type="text"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="salary"
            label="Salary"
            type="text"
            fullWidth
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="joining-date"
            label="Joining Date"
            type="date"
            fullWidth
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: 2, marginRight: '20px' }}
          >
            Upload ID Proof
            <input
              type="file"
              hidden
              onChange={(e) => setIdProof(e.target.files ? e.target.files[0] : null)}
            />
          </Button>
          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: 2 }}
          >
            Upload Photo
            <input
              type="file"
              hidden
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            />
          </Button>

          {idProof && (
            <div>
              <Typography variant="h6">Uploaded ID Proof</Typography>
              <img src={URL.createObjectURL(idProof)} alt="ID Proof" width={200} />
            </div>
          )}

          {photo && (
            <div>
              <Typography variant="h6">Uploaded Photo</Typography>
              <img src={URL.createObjectURL(photo)} alt="Employee Photo" width={200} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setupOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// Pagination function
function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
