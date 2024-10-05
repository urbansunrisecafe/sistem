import { Outlet, Link } from "react-router-dom";

const Records = () => {
  return (
    <div>

      <Outlet /> {/* Esto muestra el contenido de las rutas hijas */}
    </div>
  );
};

export default Records;
