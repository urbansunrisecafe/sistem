// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddSale from "./components/AddSale";
import AddPurchase from "./components/AddPurchase";
import AddProduction from "./components/AddProduction";
import SalesList from "./components/SalesList";
import PurchasesList from "./components/PurchasesList";
import AddNewInput from "./components/AddNewInput";
import AddNewProduct from "./components/AddNewProduct";
import AddProductVariety from "./components/AddProductVariety";
import ProductionList from "./components/ProductionList";
import "./App.css"; // Asegúrate de importar el archivo CSS
import Register from "./components/Register";
import Records from "./components/Records";

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <ul className="menu">
          <li>
            <Link to="/vender">Vender</Link>
          </li>
          <li>
            <Link to="/comprar">Comprar</Link>
          </li>
          <li>
            <Link to="/produccion">Producción</Link>
          </li>
          {/* Agrupando rutas de registros */}
          <li>
            <Link to="/registros">Registros</Link>
            <ul className="submenu">
              <li>
                <Link to="/registros/ventas">Ventas</Link>
              </li>
              <li>
                <Link to="/registros/compras">Compras</Link>
              </li>
              <li>
                <Link to="/registros/produccion">Producción</Link>
              </li>
            </ul>
          </li>
          {/* Agrupando rutas de registrar */}
          <li>
            <Link to="/registrar">Registrar</Link>
            <ul className="submenu">
              <li>
                <Link to="/registrar/insumos">Nuevo Insumo</Link>
              </li>
              <li>
                <Link to="/registrar/productos">Nuevo Producto</Link>
              </li>
              <li>
                <Link to="/registrar/variedadProducto" >Nueva Variedad</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/vender" element={<AddSale />} />
          <Route path="/comprar" element={<AddPurchase />} />
          <Route path="/produccion" element={<AddProduction />} />

          {/* Agrupando las rutas de registros */}
          <Route path="/registros" element={<Records />}>
            <Route path="ventas" element={<SalesList />} />
            <Route path="compras" element={<PurchasesList />} />
            <Route path="produccion" element={<ProductionList />} />
          </Route>

          {/* Agrupando las rutas de registrar */}
          <Route path="/registrar" element={<Register />}>
            <Route path="insumos" element={<AddNewInput />} />
            <Route path="productos" element={<AddNewProduct />} />
            <Route path="variedadProducto" element={<AddProductVariety />} />
          
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
