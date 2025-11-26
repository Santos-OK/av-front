import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Collapse,
  IconButton,
  Alert,
  styled
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Event, 
  Schedule, 
  Inventory,
  MeetingRoom,
  KeyboardArrowDown,
  KeyboardArrowUp,
  People,
  LocationOn,
  Pending,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useEquipment } from '../context/EquipmentContext';
import { useClassroom } from '../context/ClassroomContext';

const NotificationCard = styled(Card)(({ theme, status }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid ${
    status === 'approved' ? '#4CAF50' : 
    status === 'rejected' ? '#f44336' : 
    '#FFA000'
  }`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const ItemBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #e0e0e0',
}));

const ExpandButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
}));

// Función para formatear fechas
const formatDate = (date) => {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatShortDate = (date) => {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('es-ES');
};

// Componente para el chip de estado
const StatusChip = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Chip
          icon={<Pending />}
          label="Pendiente de aprobación"
          color="warning"
          variant="outlined"
        />
      );
    case 'approved':
      return (
        <Chip
          icon={<CheckCircle />}
          label="Aprobada"
          color="success"
          variant="outlined"
        />
      );
    case 'rejected':
      return (
        <Chip
          icon={<Cancel />}
          label="Rechazada"
          color="error"
          variant="outlined"
        />
      );
    default:
      return <Chip label="Desconocido" color="default" />;
  }
};

export default function Notifications() {
  const equipmentContext = useEquipment();
  const classroomContext = useClassroom();
  const [expandedNotifications, setExpandedNotifications] = useState({});

  // Combinar notificaciones de ambos contextos
  const combinedNotifications = [
    ...(equipmentContext.state.notifications || []),
    ...(classroomContext.state.notifications || [])
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const toggleExpand = (notificationId) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
  };

  // Calcular estadísticas para una notificación
  const getNotificationStats = (notification) => {
    const items = notification.items || [];
    const equipmentItems = items.filter(item => item.type === 'equipment');
    const classroomItems = items.filter(item => item.type === 'classroom');
    
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    return {
      totalItems,
      equipmentCount: equipmentItems.length,
      classroomCount: classroomItems.length,
      equipmentItems,
      classroomItems,
      hasOnlyClassrooms: equipmentItems.length === 0 && classroomItems.length > 0,
      hasOnlyEquipment: equipmentItems.length > 0 && classroomItems.length === 0,
      hasBoth: equipmentItems.length > 0 && classroomItems.length > 0
    };
  };

  if (combinedNotifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay notificaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tus reservas y solicitudes aparecerán aquí
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#8B0000" fontWeight="bold">
        Mis Reservas y Solicitudes
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Historial de todas tus solicitudes de reserva
      </Typography>

      {combinedNotifications.map((notification) => {
        const isExpanded = expandedNotifications[notification.id] || false;
        const stats = getNotificationStats(notification);
        
        return (
          <NotificationCard key={notification.id} status={notification.status}>
            <CardContent>
              {/* Header de la notificación */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="#8B0000">
                    {notification.status === 'pending' ? 'Solicitud' : 'Reserva'} #{notification.id.toString().slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {notification.status === 'pending' ? 'Solicitado' : 
                     notification.status === 'approved' ? 'Aprobado' : 'Rechazado'} el {notification.date}
                  </Typography>
                  {notification.approvedDate && (
                    <Typography variant="body2" color="success.main">
                      Aprobado por administrador: {notification.approvedDate}
                    </Typography>
                  )}
                  {notification.rejectedDate && (
                    <Typography variant="body2" color="error.main">
                      Rechazado por administrador: {notification.rejectedDate}
                    </Typography>
                  )}
                </Box>
                <StatusChip status={notification.status} />
              </Box>

              {/* Información de rechazo */}
              {notification.status === 'rejected' && notification.rejectionReason && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Razón del rechazo: {notification.rejectionReason}
                  </Typography>
                </Alert>
              )}

              {/* Información de aprobación */}
              {notification.status === 'approved' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="bold">
                    ✅ Tu reserva ha sido aprobada. Puedes recoger el equipo/reservar el salón según las fechas establecidas.
                  </Typography>
                </Alert>
              )}

              {/* Información general de la reserva */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff9e6', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  📋 Resumen General
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total de items:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {stats.totalItems}
                    </Typography>
                  </Box>
                  {stats.equipmentCount > 0 && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Equipos:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {stats.equipmentCount}
                      </Typography>
                    </Box>
                  )}
                  {stats.classroomCount > 0 && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Salones:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {stats.classroomCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Header desplegable de items reservados */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  }
                }}
                onClick={() => toggleExpand(notification.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Icono dinámico según el tipo de items */}
                    {stats.hasOnlyClassrooms ? (
                      <MeetingRoom sx={{ color: '#238F74' }} />
                    ) : stats.hasOnlyEquipment ? (
                      <Inventory sx={{ color: '#D4AF37' }} />
                    ) : (
                      <Inventory sx={{ color: '#D4AF37' }} />
                    )}
                    
                    {/* Texto dinámico según el tipo de items */}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {stats.hasOnlyClassrooms 
                        ? `Salones Reservados (${stats.classroomCount})`
                        : stats.hasOnlyEquipment
                        ? `Equipos Reservados (${stats.equipmentCount})`
                        : `Items Reservados (${stats.equipmentCount + stats.classroomCount})`
                      }
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {stats.equipmentCount > 0 && (
                      <Chip 
                        label={`${stats.equipmentCount} equipo${stats.equipmentCount !== 1 ? 's' : ''}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                    {stats.classroomCount > 0 && (
                      <Chip 
                        label={`${stats.classroomCount} salón${stats.classroomCount !== 1 ? 'es' : ''}`} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                </Box>
                
                <ExpandButton size="small">
                  {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </ExpandButton>
              </Box>

              {/* Lista de items desplegable */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                  {/* Equipos */}
                  {stats.equipmentItems.map((item, index) => (
                    <ItemBox key={`equipment-${index}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Inventory sx={{ color: '#D4AF37', fontSize: 20 }} />
                        <Chip
                          label="Equipo"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      {/* Información del equipo */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              backgroundColor: '#D4AF37',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: '20px',
                              mt: 0.5
                            }}
                          />
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="textSecondary">
                            Cantidad: <strong>{item.quantity}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Duración: <strong>{item.rentalDays} días</strong>
                          </Typography>
                        </Box>
                      </Box>

                      {/* Fechas específicas de este equipo */}
                      {item.startDate && (
                        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e8f5e8' }}>
                          <Typography variant="body2" fontWeight="bold" color="#8B0000" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            📅 Fechas de préstamo:
                          </Typography>
                          
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Event sx={{ fontSize: 16, color: '#8B0000', mr: 1 }} />
                                <Typography variant="body2" fontWeight="medium">
                                  Inicio:
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.startDate ? formatDate(item.startDate) : 'Por confirmar'}
                              </Typography>
                              {item.startDate && (
                                <Typography variant="caption" color="textSecondary">
                                  ({formatShortDate(item.startDate)})
                                </Typography>
                              )}
                            </Box>

                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Schedule sx={{ fontSize: 16, color: '#2E7D32', mr: 1 }} />
                                <Typography variant="body2" fontWeight="medium">
                                  Retorno:
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {item.returnDate ? formatDate(item.returnDate) : 'Por confirmar'}
                              </Typography>
                              {item.returnDate && (
                                <Typography variant="caption" color="textSecondary">
                                  ({formatShortDate(item.returnDate)})
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Estado del equipo */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                        <Typography variant="caption" color="textSecondary">
                          ID: {item.id}
                        </Typography>
                        <Chip
                          label={notification.status === 'approved' ? "Listo para recoger" : 
                                notification.status === 'pending' ? "Esperando aprobación" : "Rechazado"}
                          color={notification.status === 'approved' ? "success" : 
                                notification.status === 'pending' ? "warning" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </ItemBox>
                  ))}

                  {/* Salones */}
                  {stats.classroomItems.map((item, index) => (
                    <ItemBox key={`classroom-${index}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MeetingRoom sx={{ color: '#238F74', fontSize: 20 }} />
                        <Chip
                          label="Salón"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                      
                      {/* Información del salón */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              backgroundColor: '#238F74',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: '20px',
                              mt: 0.5
                            }}
                          />
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="textSecondary">
                            Capacidad: <strong>{item.capacity} personas</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Duración: <strong>{item.rentalDays} días</strong>
                          </Typography>
                        </Box>
                      </Box>

                      {/* Información específica del salón */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOn sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            <strong>Ubicación:</strong> {item.location}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Fechas específicas de este salón */}
                      {item.startDate && (
                        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e8f5e8' }}>
                          <Typography variant="body2" fontWeight="bold" color="#8B0000" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            📅 Fechas de reserva:
                          </Typography>
                          
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Event sx={{ fontSize: 16, color: '#8B0000', mr: 1 }} />
                                <Typography variant="body2" fontWeight="medium">
                                  Inicio:
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.startDate ? formatDate(item.startDate) : 'Por confirmar'}
                              </Typography>
                              {item.startDate && (
                                <Typography variant="caption" color="textSecondary">
                                  ({formatShortDate(item.startDate)})
                                </Typography>
                              )}
                            </Box>

                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Schedule sx={{ fontSize: 16, color: '#2E7D32', mr: 1 }} />
                                <Typography variant="body2" fontWeight="medium">
                                  Fin:
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {item.returnDate ? formatDate(item.returnDate) : 'Por confirmar'}
                              </Typography>
                              {item.returnDate && (
                                <Typography variant="caption" color="textSecondary">
                                  ({formatShortDate(item.returnDate)})
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Estado del salón */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                        <Typography variant="caption" color="textSecondary">
                          ID: {item.id}
                        </Typography>
                        <Chip
                          label={notification.status === 'approved' ? "Reservado" : 
                                notification.status === 'pending' ? "Esperando aprobación" : "Rechazado"}
                          color={notification.status === 'approved' ? "success" : 
                                notification.status === 'pending' ? "warning" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </ItemBox>
                  ))}
                </Box>
              </Collapse>

              {/* Información adicional - Siempre visible */}
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="bold" color="#2E7D32" gutterBottom>
                  💡 Información importante
                </Typography>
                <Typography variant="body2" color="#2E7D32">
                  {notification.status === 'pending' 
                    ? "Tu solicitud está siendo revisada por el administrador. Recibirás una notificación cuando sea procesada."
                    : notification.status === 'approved'
                    ? "Presenta tu credencial estudiantil al recoger el equipo y acceder a los salones reservados."
                    : "Si tienes preguntas sobre el rechazo, contacta al administrador del sistema."
                  }
                </Typography>
              </Box>
            </CardContent>
          </NotificationCard>
        );
      })}
    </Box>
  );
}