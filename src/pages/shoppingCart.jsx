import React from 'react';
import { useEquipment } from "../context/EquipmentContext";
import { useClassroom } from "../context/ClassroomContext";
import { useNavigate } from 'react-router';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Button,
    Divider,
    Grid,
    Paper,
    Chip,
    Alert,
    styled
} from '@mui/material';
import {
    Delete,
    CalendarToday,
    AccessTime,
    School,
    EventAvailable,
    People,
    LocationOn
} from '@mui/icons-material';

// Colores
const tintoColor = '#8B0000';
const doradoColor = '#D4AF37';

// Styled components
const CartContainer = styled(Box)(({ theme }) => ({
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(3),
    minHeight: '80vh',
}));

const CartItemCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
    },
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: `2px solid ${doradoColor}`,
    position: 'sticky',
    top: theme.spacing(2),
}));

const DoradoButton = styled(Button)(({ theme }) => ({
    backgroundColor: doradoColor,
    color: '#FFF',
    fontWeight: 'bold',
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: '#B8860B',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    transition: 'all 0.3s ease',
}));

const ScrollableItemsContainer = styled(Box)(({ theme }) => ({
    maxHeight: '70vh',
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
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

export default function ShoppingCart() {
    const equipmentContext = useEquipment();
    const classroomContext = useClassroom();
    const navigate = useNavigate();

    // Combinar ambos carritos
    const combinedCart = [
        ...(equipmentContext.state.cart || []),
        ...(classroomContext.state.cart || [])
    ];

    const removeItem = (id, type) => {
        if (type === 'equipment') {
            equipmentContext.actions.removeFromCart(id);
        } else {
            classroomContext.actions.removeFromCart(id);
        }
    };

    const calculateTotalItems = () => {
        return combinedCart.reduce((total, item) => total + item.quantity, 0);
    };

    const handleReservation = () => {
        const hasEquipmentItems = equipmentContext.state.cart.length > 0;
        const hasClassroomItems = classroomContext.state.cart.length > 0;

        if (!hasEquipmentItems && !hasClassroomItems) {
            alert('El carrito está vacío');
            return;
        }

        // Enviar para aprobación
        if (hasEquipmentItems) {
            equipmentContext.actions.submitForApproval();
        }

        if (hasClassroomItems) {
            classroomContext.actions.submitForApproval();
        }

        alert('¡Solicitud de reserva enviada! Espera la aprobación del administrador. Revisa tus notificaciones para updates.');
        navigate('/notifications');
    };

    // Contar items por tipo
    const equipmentCount = combinedCart.filter(item => item.type === 'equipment').length;
    const classroomCount = combinedCart.filter(item => item.type === 'classroom').length;

    if (combinedCart.length === 0) {
        return (
            <CartContainer>
                <Box textAlign="center" py={10}>
                    <Typography variant="h4" color="textSecondary" gutterBottom>
                        🛒 Tu carrito está vacío
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Explora nuestro equipo audiovisual y salones disponibles para tus proyectos universitarios
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <DoradoButton
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/equipment")}
                        >
                            Explorar Equipo
                        </DoradoButton>
                        <DoradoButton
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/classrooms")}
                        >
                            Explorar Salones
                        </DoradoButton>
                    </Box>
                </Box>
            </CartContainer>
        );
    }

    return (
        <CartContainer>
            {/* Header del carrito */}
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom color={tintoColor}>
                    Mis Reservas
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Gestiona tu equipo y salones reservados para proyectos universitarios
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                    🎓 Servicio exclusivo para estudiantes - Sin costo
                </Typography>
                <Typography variant="body2">
                    Reserva de equipos y salones para proyectos académicos y actividades universitarias.
                </Typography>
            </Alert>

            <Grid container spacing={4}>
                {/* Lista de items reservados */}
                <Grid item xs={12} md={8}>
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Items Reservados ({calculateTotalItems()} items)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Chip
                                label={`${equipmentCount} equipos`}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                label={`${classroomCount} salones`}
                                color="secondary"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>

                    <ScrollableItemsContainer>
                        {combinedCart.map((item) => (
                            <CartItemCard key={`${item.type}-${item.id}`}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 140, objectFit: 'cover' }}
                                    image={item.image}
                                    alt={item.name}
                                />
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                {item.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                                <Chip
                                                    label={item.category}
                                                    size="small"
                                                    sx={{ backgroundColor: doradoColor, color: 'white' }}
                                                />
                                                <Chip
                                                    label={item.type === 'classroom' ? 'Salón' : 'Equipo'}
                                                    size="small"
                                                    variant="outlined"
                                                    color={item.type === 'classroom' ? 'primary' : 'secondary'}
                                                />
                                            </Box>
                                        </Box>
                                        <IconButton
                                            onClick={() => removeItem(item.id, item.type)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>

                                    {/* Información específica por tipo */}
                                    {item.type === 'classroom' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <People sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Capacidad: <strong>{item.capacity} personas</strong>
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationOn sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {item.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Información de días de reserva */}
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <CalendarToday sx={{ fontSize: 18, color: tintoColor, mr: 1 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            {item.type === 'classroom' ? 'Días de reserva' : 'Días de préstamo'}:
                                            <strong> {item.rentalDays} días</strong>
                                        </Typography>
                                    </Box>

                                    {/* Fechas específicas del item */}
                                    {item.startDate && (
                                        <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                            <Typography variant="body2" fontWeight="bold" color="#8B0000" gutterBottom>
                                                📅 Fechas de {item.type === 'classroom' ? 'Reserva' : 'Préstamo'}:
                                            </Typography>
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="textSecondary">
                                                        Inicio:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatShortDate(item.startDate)}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {item.type === 'classroom' ? 'Fin' : 'Retorno'}:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                                        {formatShortDate(item.returnDate)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    <Box display="flex" alignItems="center" mb={2}>
                                        <AccessTime sx={{ fontSize: 18, color: '#4CAF50', mr: 1 }} />
                                        <Typography
                                            variant="body2"
                                            color={'success.main'}
                                            fontWeight="bold"
                                        >
                                            {item.type === 'classroom' ? 'Salón reservado' : 'Equipo reservado'}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="h6" mx={2}>
                                                Cantidad: {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={<EventAvailable />}
                                            label="En carrito"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </CardContent>
                            </CartItemCard>
                        ))}
                    </ScrollableItemsContainer>
                </Grid>

                {/* Resumen de la reserva */}
                <Grid item xs={12} md={4}>
                    <SummaryCard>
                        <Typography variant="h5" fontWeight="bold" gutterBottom color={tintoColor}>
                            Resumen de Reserva
                        </Typography>

                        <Box mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body1">Total de items:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {calculateTotalItems()}
                                </Typography>
                            </Box>

                            {/* Desglose por tipo */}
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="textSecondary">
                                    Equipos:
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {equipmentCount}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2" color="textSecondary">
                                    Salones:
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {classroomCount}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="h6">Estado:</Typography>
                                <Chip label="Pendiente de envío" color="warning" />
                            </Box>
                        </Box>

                        {/* Información de la reserva */}
                        <Box mb={3}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                📅 Proceso de Aprobación
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                Tu solicitud será revisada por un administrador. Recibirás una notificación cuando sea aprobada o rechazada.
                            </Typography>
                        </Box>

                        {/* Botón de confirmación */}
                        <DoradoButton
                            fullWidth
                            size="large"
                            startIcon={<EventAvailable />}
                            onClick={handleReservation}
                            sx={{ mb: 2 }}
                        >
                            Solicitar Aprobación
                        </DoradoButton>

                        {/* Beneficios para estudiantes */}
                        <Box mt={3}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <School sx={{ color: doradoColor, mr: 1 }} />
                                <Typography variant="body2">Exclusivo para proyectos académicos</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <CalendarToday sx={{ color: doradoColor, mr: 1 }} />
                                <Typography variant="body2">Máximo 7 días por reserva</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <EventAvailable sx={{ color: doradoColor, mr: 1 }} />
                                <Typography variant="body2">Renovación sujeta a disponibilidad</Typography>
                            </Box>
                        </Box>
                    </SummaryCard>

                    {/* Recordatorios importantes */}
                    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="#856404">
                            ⏳ Proceso de Aprobación
                        </Typography>
                        <Typography variant="body2" color="#856404">
                            • Tu reserva será revisada por un administrador<br />
                            • Recibirás una notificación cuando sea aprobada o rechazada<br />
                            • El proceso toma normalmente 24 horas<br />
                            • Contacta a soporte si necesitas ayuda urgente
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </CartContainer>
    );
}