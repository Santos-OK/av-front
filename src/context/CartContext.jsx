import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  cart: []
};

const ACTIONS = {
  ADD_EQUIPMENT_TO_CART: 'ADD_EQUIPMENT_TO_CART',
  ADD_CLASSROOM_TO_CART: 'ADD_CLASSROOM_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  CONFIRM_RESERVATION: 'CONFIRM_RESERVATION'
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_EQUIPMENT_TO_CART:
      const { equipment, quantity, startDate, returnDate } = action.payload;
      
      const existingEquipment = state.cart.find(item => 
        item.id === equipment.id && item.type === 'equipment'
      );
      
      if (existingEquipment) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === equipment.id && item.type === 'equipment'
              ? { 
                  ...item, 
                  quantity: item.quantity + quantity,
                  startDate: startDate,
                  returnDate: returnDate
                }
              : item
          )
        };
      } else {
        const cartItem = {
          id: equipment.id,
          name: equipment.name,
          category: equipment.category,
          image: equipment.image,
          quantity: quantity,
          rentalDays: equipment.quantity === 1 ? 1 : 7,
          startDate: startDate,
          returnDate: returnDate,
          type: 'equipment',
          description: equipment.description,
          available: equipment.available
        };
        
        return {
          ...state,
          cart: [...state.cart, cartItem]
        };
      }

    case ACTIONS.ADD_CLASSROOM_TO_CART:
      const { classroom, quantity: classroomQuantity, startDate: classroomStartDate, returnDate: classroomReturnDate } = action.payload;
      
      const existingClassroom = state.cart.find(item => 
        item.id === classroom.id && item.type === 'classroom'
      );
      
      if (existingClassroom) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === classroom.id && item.type === 'classroom'
              ? { 
                  ...item, 
                  quantity: item.quantity + classroomQuantity,
                  startDate: classroomStartDate,
                  returnDate: classroomReturnDate
                }
              : item
          )
        };
      } else {
        const cartItem = {
          id: classroom.id,
          name: classroom.name,
          category: classroom.category,
          image: classroom.image,
          quantity: classroomQuantity,
          rentalDays: classroom.quantity === 1 ? 1 : 7,
          startDate: classroomStartDate,
          returnDate: classroomReturnDate,
          type: 'classroom',
          capacity: classroom.capacity,
          location: classroom.location,
          description: classroom.description,
          available: classroom.available
        };
        
        return {
          ...state,
          cart: [...state.cart, cartItem]
        };
      }

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id || item.type !== action.payload.type)
      };

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: []
      };

    case ACTIONS.CONFIRM_RESERVATION:
      // Aquí puedes agregar lógica para guardar la reserva confirmada
      console.log('Reserva confirmada:', state.cart);
      return {
        ...state,
        cart: [] // Vaciar carrito después de confirmar
      };

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const actions = {
    addEquipmentToCart: (equipment, quantity, startDate, returnDate) => dispatch({
      type: ACTIONS.ADD_EQUIPMENT_TO_CART,
      payload: { equipment, quantity, startDate, returnDate }
    }),
    
    addClassroomToCart: (classroom, quantity, startDate, returnDate) => dispatch({
      type: ACTIONS.ADD_CLASSROOM_TO_CART,
      payload: { classroom, quantity, startDate, returnDate }
    }),
    
    removeFromCart: (id, type) => dispatch({
      type: ACTIONS.REMOVE_FROM_CART,
      payload: { id, type }
    }),
    
    clearCart: () => dispatch({
      type: ACTIONS.CLEAR_CART
    }),
    
    confirmReservation: () => dispatch({
      type: ACTIONS.CONFIRM_RESERVATION
    })
  };

  return (
    <CartContext.Provider value={{ state, actions }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};