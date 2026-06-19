import { Customer } from "./customer/feature/customer.page";
import { ManagementDashboard } from "./Movement/feature/page/ManagementDashboard";
import { MovementDashboard } from "./Movement/feature/page/MovementDashboard";
import { MovementDashboardComp } from "./Movement/feature/page/MovementDashboardComp";
import { Movement } from "./Movement/feature/page/moviment.page";
import { PaymentMethodList } from "./Movement/feature/page/PaymentMethod.page";


function App() {
  return (
  <>
 {/* <Customer /> */}
 {/* <Movement/> */}
 <ManagementDashboard/>
 {/* <MovementDashboard/> */}
 <MovementDashboardComp/>
 
 {/* <PaymentMethodList/> */}
  </>
  );
}

export default App;