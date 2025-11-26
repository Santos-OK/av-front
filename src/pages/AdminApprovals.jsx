import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled
} from '@mui/material';
import { 
  Check, 
  Close, 
  Event, 
  Inventory, 
  MeetingRoom,
  Person,
  Schedule,
  PendingActions
} from '@mui/icons-material';
import { useEquipment } from '../context/EquipmentContext';
import { useClassroom } from '../context/ClassroomContext';

const ApprovalCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid #FFA000`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const ApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: 'white',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

const RejectButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#f44336',
  color: 'white',
  marginLeft: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#da190b',
  },
}));

export default function AdminApprovals() {
  const equipmentContext = useEquipment();
  const classroomContext = useClassroom();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Combinar aprobaciones pendientes de ambos contextos
  const pendingApprovals = [
    ...(equipmentContext.state.pendingApprovals || []).map(approval => ({
      ...approval,
      source: 'equipment'
    })),
    ...(classroomContext.state.pendingApprovals || []).map(approval => ({
      ...approval,
      source: 'classroom'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleApprove = (reservation) => {
    if (reservation.source === 'equipment') {
      equipmentContext.actions.approveReservation(reservation.id);
    } else {
      classroomContext.actions.approveReservation(reservation.id);
    }
  };

  const handleReject = (reservation) => {
    setSelectedReservation(reservation);
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedReservation) {
      if (selectedReservation.source === 'equipment') {
        equipmentContext.actions.rejectReservation(
          selectedReservation.id, 
          rejectionReason
        );
      } else {
        classroomContext.actions.rejectReservation(
          selectedReservation.id, 
          rejectionReason
        );
      }
    }
    setRejectDialogOpen(false);
    setSelectedReservation(null);
    setRejectionReason('');
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (pendingApprovals.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Check sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay solicitudes pendientes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Todas las solicitudes de reserva han sido procesadas
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#8B0000" fontWeight="bold">
        Aprobaciones Pendientes
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Gestiona las solicitudes de reserva de equipos y salones
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instrucciones:</strong> Revisa cada solicitud y aprueba o rechaza según la disponibilidad y políticas.
        </Typography>
      </Alert>

      {pendingApprovals.map((reservation) => (
        <ApprovalCard key={reservation.id}>
          <CardContent>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="#8B0000">
                  Solicitud #{reservation.id.toString().slice(-6)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Solicitado el {reservation.date}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Person sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {reservation.userName || 'Usuario'} ({reservation.userId})
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Pendiente"
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  icon={<PendingActions />}
                  label={reservation.source === 'equipment' ? 'Equipo' : 'Salón'}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

            {/* Items de la reserva */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📋 Items Solicitados:
              </Typography>
              <Grid container spacing={2}>
                {reservation.items.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {item.type === 'classroom' ? (
                          <MeetingRoom color="primary" />
                        ) : (
                          <Inventory color="secondary" />
                        )}
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        Categoría: {item.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Cantidad: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Días: {item.rentalDays}
                      </Typography>
                      {item.startDate && (
                        <Typography variant="body2" color="textSecondary">
                          Fecha inicio: {formatDate(item.startDate)}
                        </Typography>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Acciones */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <ApproveButton
                startIcon={<Check />}
                onClick={() => handleApprove(reservation)}
              >
                Aprobar
              </ApproveButton>
              <RejectButton
                startIcon={<Close />}
                onClick={() => handleReject(reservation)}
              >
                Rechazar
              </RejectButton>
            </Box>
          </CardContent>
        </ApprovalCard>
      ))}

      {/* Diálogo para razón de rechazo */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Rechazar Solicitud</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Por qué estás rechazando esta solicitud?
          </Typography>
          <TextField
            autoFocus
            label="Razón del rechazo"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ej: Equipo no disponible, conflicto de horarios, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={confirmReject} 
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}