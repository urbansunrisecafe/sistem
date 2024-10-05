import { Outlet, Link } from "react-router-dom";

const Register = () => {
  return (
    <div>
     
      <Outlet /> {/* Muestra el contenido de las rutas hijas */}
    </div>
  );
};

export default Register;
