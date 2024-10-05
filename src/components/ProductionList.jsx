import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ProductionList = () => {
  const [productos, setProductos] = useState([]);
  const [producciones, setProducciones] = useState({});

  // Obtener productos desde Firestore (solo de la categoría Repostería)
  const fetchProductos = async () => {
    const productosCollection = collection(db, "Productos");
    const productosSnapshot = await getDocs(productosCollection);
    const productosList = productosSnapshot.docs
      .filter((doc) => doc.data().categoria === "Repostería")
      .map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        variedades: doc.data().saborTamaño,
      }));
    setProductos(productosList);
  };

  // Obtener las proyecciones correspondientes a cada variedad de los productos
  const fetchProducciones = async (productos) => {
    let produccionesData = {};
    for (const producto of productos) {
      for (const variedad of producto.variedades) {
        if (variedad.proyeccionId) {
          const proyeccionRef = doc(db, "Proyecciones", variedad.proyeccionId);
          const proyeccionSnapshot = await getDoc(proyeccionRef);
          if (proyeccionSnapshot.exists()) {
            produccionesData[variedad.proyeccionId] = proyeccionSnapshot.data();
          }
        }
      }
    }
    setProducciones(produccionesData);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductos();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      fetchProducciones(productos);
    }
  }, [productos]);

  return (
    <div>
      <h2>Lista de Producción</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Variedad</th>
            <th>Unidades Iniciales</th>
            <th>Unidades Finales</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) =>
            producto.variedades.map((variedad, index) => (
              <tr key={`${producto.id}-${index}`}>
                <td>{producto.nombre}</td>
                <td>{variedad.nombre}</td>
                <td>{variedad.unidadesIniciales}</td>
                <td>{variedad.unidadesFinales}</td>
                <td>
                  {variedad.proyeccionId && producciones[variedad.proyeccionId]
                    ? producciones[variedad.proyeccionId].fechaRegistro
                    : "No registrada"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionList;
