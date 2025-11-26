import { EquipmentProvider } from './context/EquipmentContext';
import { ClassroomProvider } from './context/ClassroomContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout';

function App() {
  return (
    <CartProvider>
      <ClassroomProvider>
        <EquipmentProvider>
          <Layout />
        </EquipmentProvider>
      </ClassroomProvider>
    </CartProvider>
  );
}

export default App;