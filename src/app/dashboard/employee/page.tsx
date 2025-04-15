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
import Employeee from '@/components/dashboard/employee';

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
   <Employeee />  
    </Stack>
  );
}

