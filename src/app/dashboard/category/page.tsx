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
import { CategroyTable } from '@/components/dashboard/categorytable';

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [open, setOpen] = React.useState(false); 
  const [upopen,setupOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState('');
  const [categoryDescription, setCategoryDescription] = React.useState('');
  const [categories, setCategories] = React.useState<Customer[]>([]);
  const [editCategoryId, setEditCategoryId] = React.useState<string | null>(null); // Track the category ID to edit

  const paginatedCustomers = applyPagination(categories, page, rowsPerPage);

  // Fetch categories
  const getCategory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getcategory');
      if (response.status === 200) {
        setCategories(response.data.categories);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    }
  };

  React.useEffect(() => {
    getCategory();
  }, []);

  // Handle form submit for adding new category
  const handleSubmit = async () => {
    const categoryData = { name: categoryName, description: categoryDescription };
    try {
      const response = await axios.post('http://localhost:5000/api/category', categoryData);
      if (response.status === 201) {
        setCategoryName('');
        setCategoryDescription('');
        setupOpen(false);
        getCategory(); // Fetch categories after adding
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Category not saved. Please try again.';
      console.error(errorMessage);
    }
  };
  const handleUpdate = (id: string) => {
    setEditCategoryId(id); // Set the category ID to edit
    const category = categories.find((category) => category._id === id);
    if (category) {
      setCategoryName(category.name); // Pre-fill the fields
      setCategoryDescription(category?.description);
    }
    setOpen(true);
  };
  const handleUpdateSubmit = async () => {
    if (!editCategoryId) return;
    
    console.log('coming====')
    const categoryData = { name: categoryName, description: categoryDescription };
    try {
      const response = await axios.put(`http://localhost:5000/api/editcategory/${editCategoryId}`, categoryData);
      if (response.status === 200) {
        setCategoryName('');
        setCategoryDescription('');
        setOpen(false);
        setEditCategoryId(null); // Reset edit ID after update
        getCategory(); // Fetch categories after update
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Category not updated. Please try again.';
      console.error(errorMessage);
    }
  };
  const handleOpenAddDialog = () => {
    // Reset form fields before opening Add dialog
    setCategoryName('');
    setCategoryDescription('');
    setupOpen(true); // Open Add dialog
  };

  // Handle category delete
  const handleDelete = async (id: string) => {
      try {
          const response = await axios.delete(`http://localhost:5000/api/delete-category/${id}`);
          if (response.status === 200) {
            setCategories(categories.filter((category) => category._id !== id)); // Remove category from state
          getCategory(); // Fetch categories after update
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Category not updated. Please try again.';
        console.error(errorMessage);
      }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Category</Typography>
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
      <CategroyTable
        count={paginatedCustomers.length}
        page={page}
        rows={categories}
        rowsPerPage={rowsPerPage}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      
      {/* Dialog for Add Category */}
      <Dialog open={upopen} onClose={() => setupOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="category-name"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            required
          />
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
      {/*Dialog for update category */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="category-name"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="category-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
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
