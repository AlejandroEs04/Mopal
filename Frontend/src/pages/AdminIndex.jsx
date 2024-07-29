import InventoryContainer from '../components/InventoryContainer'
import InventoryForm from '../components/InventoryForm'
import InventoryReport from '../components/InventoryReport'
import '../styles/AdminStyles.css'

const AdminIndex = () => {
  return (
    <div>
      <InventoryForm />

      <InventoryReport />
    </div>
    )
}

export default AdminIndex