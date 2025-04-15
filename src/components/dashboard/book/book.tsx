'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';

const rows = 5;
const cols = 10;

const initialSeats = Array.from({ length: rows * cols }, (_, i) => ({
  id: i,
  booked: Math.random() < 0.2, // Randomly book ~20% seats
}));

const getSeatStatus = (seat: { id: any; booked: any; }, selected: string | any[]) => {
  if (seat.booked) return 'booked';
  if (selected.includes(seat.id)) return 'selected';
  return 'available';
};

const getColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'lightgreen';
    case 'booked':
      return 'salmon';
    case 'selected':
      return 'gold';
    default:
      return 'gray';
  }
};

export default function Book() {
  const [seats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (id: number) => {
    const seat = seats.find((s) => s.id === id);
    if (seat?.booked) return;

    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        🎟️ Book Your Movie Seat
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {seats.map((seat) => {
          const status = getSeatStatus(seat, selectedSeats);
          return (
            <Grid item key={seat.id}>
              <Paper
                elevation={3}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: getColor(status),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: seat.booked ? 'not-allowed' : 'pointer',
                  borderRadius: 1,
                }}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.id + 1}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box mt={4} display="flex" gap={2} justifyContent="center">
        <Legend color="lightgreen" label="Available" />
        <Legend color="salmon" label="Booked" />
        <Legend color="gold" label="Selected" />
      </Box>

      <Box mt={3}>
        <Button variant="contained" disabled={selectedSeats.length === 0}>
          Confirm Booking ({selectedSeats.length} seat
          {selectedSeats.length > 1 ? 's' : ''})
        </Button>
      </Box>
    </Box>
  );
}

const Legend = ({ color, label }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box width={20} height={20} bgcolor={color} borderRadius={1} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);
