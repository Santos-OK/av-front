import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Grid,
    Divider,
    styled
} from '@mui/material';
import {
    People,
    CalendarToday,
    AccessTime,
    Inventory,
    MeetingRoom,
    Event,
    CheckCircle,
    Schedule,
    Person
} from '@mui/icons-material';
import { useEquipment } from '../context/EquipmentContext';
import { useClassroom } from '../context/ClassroomContext';

// Colores
const tintoColor = '#8B0000';
const doradoColor = '#D4AF37';

const HeaderCard = styled(Card)(({ theme }) => ({
    backgroundColor: tintoColor,
    color: 'white',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const UserCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderLeft: `4px solid ${doradoColor}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
}));

const ActiveReservationCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    marginBottom: theme.spacing(2),
}));

export default function Users() {
    const equipmentContext = useEquipment();
    const classroomContext = useClassroom();

    // Combinar reservas aprobadas de ambos contextos
    const activeReservations = [
        ...(equipmentContext.state.reservations || []),
        ...(classroomContext.state.reservations || [])
    ].filter(reservation => reservation.status === 'approved');

    // Agrupar por usuario
    const usersMap = {};
    activeReservations.forEach(reservation => {
        const userId = reservation.userId || 'user123';
        if (!usersMap[userId]) {
            usersMap[userId] = {
                id: userId,
                name: reservation.userName || 'Estudiante Universitario',
                email: `${userId}@universidad.edu`,
                studentId: userId,
                reservations: [],
                totalItems: 0,
                avatar: `/static/images/avatar/${userId.charAt(userId.length - 1)}.jpg`
            };
        }
        usersMap[userId].reservations.push(reservation);
        usersMap[userId].totalItems += reservation.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    const usersWithLoans = Object.values(usersMap);

    const formatDate = (date) => {
        if (!date) return '--';
        return new Date(date).toLocaleDateString('es-ES');
    };

    const calculateDaysRemaining = (returnDate) => {
        if (!returnDate) return '--';
        const returnDateObj = new Date(returnDate);
        const today = new Date();
        const diffTime = returnDateObj - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <HeaderCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <People sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Gestión de Usuarios
                        </Typography>
                        <Typography variant="body1">
                            Usuarios con préstamos activos actualmente
                        </Typography>
                    </Box>
                </Box>
            </HeaderCard>

            {/* Estadísticas */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Card sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
                    <People sx={{ fontSize: 40, color: tintoColor, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                        Total Usuarios
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color={tintoColor}>
                        {usersWithLoans.length}
                    </Typography>
                </Card>
                <Card sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
                    <Inventory sx={{ fontSize: 40, color: doradoColor, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                        Préstamos Activos
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color={doradoColor}>
                        {usersWithLoans.reduce((total, user) => total + user.reservations.length, 0)}
                    </Typography>
                </Card>
                <Card sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
                    <MeetingRoom sx={{ fontSize: 40, color: '#238F74', mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                        Items Totales
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="#238F74">
                        {usersWithLoans.reduce((total, user) => total + user.totalItems, 0)}
                    </Typography>
                </Card>
            </Box>

            {/* Lista de usuarios */}
            <Typography variant="h4" gutterBottom fontWeight="bold" color={tintoColor}>
                👥 Usuarios con Préstamos Activos
            </Typography>

            {usersWithLoans.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CheckCircle sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No hay préstamos activos
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Los préstamos aprobados aparecerán aquí
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {usersWithLoans.map((user) => (
                        <Grid item xs={12} key={user.id}>
                            <UserCard>
                                <CardContent>
                                    {/* Información del usuario */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                                        <Avatar
                                            src={user.avatar}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                border: `3px solid ${doradoColor}`,
                                                bgcolor: '#D4AF37'
                                            }}
                                        >
                                            <Person sx={{ fontSize: 40 }} />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h5" fontWeight="bold">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                                {user.email}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={`ID: ${user.studentId}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`${user.reservations.length} reserva(s)`}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`${user.totalItems} items total`}
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Chip
                                                label="Activo"
                                                color="success"
                                                sx={{ mb: 1, fontWeight: 'bold' }}
                                            />
                                            <Typography variant="body2" color="textSecondary">
                                                Usuario Verificado
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Reservas activas */}
                                    <Typography variant="h6" fontWeight="bold" gutterBottom color={tintoColor}>
                                        📋 Préstamos Activos:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {user.reservations.map((reservation, index) => (
                                            <Grid item xs={12} md={6} key={reservation.id}>
                                                <ActiveReservationCard>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                Reserva #{reservation.id.toString().slice(-6)}
                                                            </Typography>
                                                            <Chip
                                                                label="Activa"
                                                                color="success"
                                                                size="small"
                                                                icon={<CheckCircle />}
                                                            />
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                Aprobada: {reservation.approvedDate}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                Solicitada: {reservation.date}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            📦 Items Prestados:
                                                        </Typography>
                                                        {reservation.items.map((item, itemIndex) => {
                                                            const daysRemaining = calculateDaysRemaining(item.returnDate);
                                                            return (
                                                                <Box
                                                                    key={itemIndex}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mb: 1,
                                                                        p: 1.5,
                                                                        backgroundColor: 'white',
                                                                        borderRadius: 1,
                                                                        border: '1px solid #e0e0e0'
                                                                    }}
                                                                >
                                                                    {item.type === 'classroom' ? (
                                                                        <MeetingRoom sx={{ fontSize: 24, color: '#238F74' }} />
                                                                    ) : (
                                                                        <Inventory sx={{ fontSize: 24, color: '#D4AF37' }} />
                                                                    )}
                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                        <Typography variant="body2" fontWeight="medium">
                                                                            {item.name}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
                                                                            <Typography variant="caption" color="textSecondary">
                                                                                {item.type === 'classroom' ? 'Salón' : 'Equipo'} •
                                                                                Cantidad: {item.quantity} •
                                                                                {item.rentalDays} días
                                                                            </Typography>
                                                                        </Box>
                                                                        {item.startDate && item.returnDate && (
                                                                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                                                                <Typography variant="caption" color="textSecondary">
                                                                                    📅 {formatDate(item.startDate)} - {formatDate(item.returnDate)}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={`${daysRemaining} días restantes`}
                                                                                    size="small"
                                                                                    color={daysRemaining <= 2 ? "error" : daysRemaining <= 5 ? "warning" : "success"}
                                                                                    variant="outlined"
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            );
                                                        })}
                                                    </CardContent>
                                                </ActiveReservationCard>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Resumen del usuario */}
                                    <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="#2E7D32">
                                            📊 Resumen del Usuario
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Total de reservas:
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {user.reservations.length}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Items en préstamo:
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {user.totalItems}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Estado:
                                                </Typography>
                                                <Chip label="Al día" color="success" size="small" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </UserCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Tabla resumen para vista rápida */}
            {usersWithLoans.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color={tintoColor}>
                        📋 Vista Rápida de Préstamos
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Usuario</strong></TableCell>
                                    <TableCell><strong>ID Estudiante</strong></TableCell>
                                    <TableCell><strong>Reservas Activas</strong></TableCell>
                                    <TableCell><strong>Items Totales</strong></TableCell>
                                    <TableCell><strong>Última Reserva</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersWithLoans.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={user.avatar}
                                                    sx={{ width: 40, height: 40 }}
                                                >
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.studentId}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.reservations.length}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.totalItems}
                                                color="secondary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.reservations.length > 0 ?
                                                formatDate(user.reservations[0].date) : 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Activo"
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
}