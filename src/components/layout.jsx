import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import Home from '../pages/home';
import Equipment from '../pages/equipment';
import Classrooms from '../pages/classrooms';
import Notifications from '../pages/notifications';
import Detail from '../pages/detail';
import NotFound from '../pages/notFound';
import ShoppingCart from '../pages/shoppingCart';
import Users from '../pages/users';
import AddInventory from '../pages/addInventory';
import AdminApprovals from '../pages/AdminApprovals';

import { Routes, Route } from "react-router";
import { Link } from "react-router";
import { useNavigate } from "react-router";

// Colores
const tintoColor = '#8B0000';
const doradoColor = '#D4AF37';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: tintoColor,
  boxShadow: 'none',
}));

// Estilos para los botones dorados
const DoradoButton = styled(Button)(({ theme }) => ({
  backgroundColor: doradoColor,
  color: '#FFF',
  fontWeight: 'bold',
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#B8860B',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

// Estilos para el botón de administrador
const AdminButton = styled(Button)(({ theme, isadmin }) => ({
  backgroundColor: isadmin === 'true' ? '#238F74' : doradoColor,
  color: '#FFF',
  fontWeight: 'bold',
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: isadmin === 'true' ? '#1A6B58' : '#B8860B',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

// Estilos para el avatar de perfil
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid ${doradoColor}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

// Estilos para el botón circular del carrito
const CartIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: doradoColor,
  color: '#FFF',
  width: 40,
  height: 40,
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: '#B8860B',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

// Estilos para los botones de administrador
const AdminMenuButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#238F74',
  color: '#FFF',
  fontWeight: 'bold',
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#1A6B58',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

export default function Layout() {
  const [sortOrder, setSortOrder] = React.useState('ascending');
  const [limit, setLimit] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const nav = useNavigate();

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleCartClick = () => {
    console.log('Carrito clickeado');
    nav("/cart")
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    console.log('Modo administrador:', !isAdmin);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Barra de navegación */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Botones a la izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DoradoButton
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
            >
              Inicio
            </DoradoButton>

            <DoradoButton
              onClick={() => nav("/notifications")}
              startIcon={<NotificationsIcon />}
            >
              Notificaciones
            </DoradoButton>

            {/* Botones de administrador - solo se muestran si isAdmin es true */}
            {isAdmin && (
              <>
                <AdminMenuButton
                  onClick={() => nav("/admin-approvals")}
                  startIcon={<CheckIcon />}
                >
                  Aprobaciones
                </AdminMenuButton>
                <AdminMenuButton
                  onClick={() => nav("/users")}
                  startIcon={<GroupIcon />}
                >
                  Usuarios
                </AdminMenuButton>
                <AdminMenuButton
                  onClick={() => nav("/add-inventory")}
                  startIcon={<InventoryIcon />}
                >
                  Añadir a Inventario
                </AdminMenuButton>
              </>
            )}

            {/* Botón circular del carrito */}
            <CartIconButton
              onClick={handleCartClick}
              aria-label="Carrito de compras"
            >
              <ShoppingCartIcon />
            </CartIconButton>
          </Box>

          {/* Elementos a la derecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Botón Cambiar a Administrador */}
            <AdminButton
              onClick={toggleAdminMode}
              isadmin={isAdmin.toString()}
              startIcon={<AdminPanelSettingsIcon />}
            >
              {isAdmin ? 'Modo Usuario' : 'Modo Administrador'}
            </AdminButton>

            {/* Círculo de foto de perfil */}
            <ProfileAvatar
              alt="Foto de perfil"
              src="/static/images/avatar/1.jpg"
              onClick={() => {
                console.log('Foto de perfil clickeada');
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: '100%'
        }}
      >
        <Routes>
          <Route path="/" element={<Home sortOrder={sortOrder} limit={limit} />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/admin-approvals" element={<AdminApprovals />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}