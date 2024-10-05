import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
y

const AddSale = () => {
  const [productos, setProductos] = useState([{ cantidad: 1, idProducto: '', variedadIndex: '' }]);
  const [promociones, setPromociones] = useState([]); // Lista de promociones
  const [variedades, setVariedades] = useState([]); // Lista de variedades del producto

  useEffect(() => {
    // Simula la obtención de promociones desde Firestore
    const fetchPromociones = async () => {
      // Aquí deberías reemplazar con tu lógica para obtener promociones
      const fetchedPromociones = await getPromociones(); // Implementa esta función
      setPromociones(fetchedPromociones);
    };
    fetchPromociones();
  }, []);

  const handlePromotionChange = (index, e) => {
    const selectedPromotion = promociones[e.target.value];
    // Obteniendo los productos de la promoción seleccionada
    const newProductos = selectedPromotion.productos.map(prod => ({
      idProducto: prod.idProducto,
      cantidad: prod.cantidad,
      variedadIndex: '', // Inicialmente sin selección
    }));
    setProductos(newProductos);
    // Obtén las variedades del primer producto para llenar el dropdown
    fetchVariedades(newProductos[0].idProducto);
  };

  const fetchVariedades = async (idProducto) => {
    // Lógica para obtener las variedades de un producto desde Firestore
    const producto = await getProductoById(idProducto); // Implementa esta función
    setVariedades(producto.saborTamaño); // Suponiendo que saborTamaño contiene las variedades
  };

  const handleVariedadChange = (index, e) => {
    const newProductos = [...productos];
    newProductos[index].variedadIndex = e.target.value;
    setProductos(newProductos);
  };

  return (
    <form>
      <div className="form-group">
        <label>Promoción:</label>
        <select onChange={(e) => handlePromotionChange(0, e)} required>
          <option value="">Seleccione una promoción</option>
          {promociones.map((promo, index) => (
            <option key={index} value={index}>
              {promo.nombre}
            </option>
          ))}
        </select>
      </div>

      {productos.map((producto, index) => (
        <div key={index}>
          <div className="form-group">
            <label>Variedad:</label>
            <select
              name="variedadIndex"
              value={producto.variedadIndex}
              onChange={(e) => handleVariedadChange(index, e)}
              required
            >
              <option value="">Seleccione una variedad</option>
              {variedades.map((variedad, pIndex) => (
                <option key={pIndex} value={pIndex}>
                  {variedad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              value={producto.cantidad}
              onChange={(e) => handleInputChange(index, e)}
              min="1"
              required
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={handleAddProduct}>
        Agregar Producto
      </button>

      <button type="submit">Registrar Venta</button>
    </form>
  );
};

export default AddSale;
