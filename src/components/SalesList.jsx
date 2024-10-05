import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesCollection = collection(db, "Ventas");
        const salesSnapshot = await getDocs(salesCollection);
        const salesList = salesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSales(salesList);
      } catch (error) {
        console.error("Error fetching sales: ", error);
      }
    };

    fetchSales();
  }, []);

  // Formatear el precio a Bs. 4.00
  const formatCurrency = (value) => {
    return `Bs. ${value.toFixed(2)}`;
  };

  // Función para eliminar una venta
  const handleDelete = async (saleId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      try {
        await deleteDoc(doc(db, "Ventas", saleId));
        setSales(sales.filter((sale) => sale.id !== saleId));
        console.log("Venta eliminada");
      } catch (error) {
        console.error("Error al eliminar la venta: ", error);
      }
    }
  };

  return (
    <div>
      <h1>Lista de Ventas</h1>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Forma de Pago</th>
            <th>Nombre del Producto</th>
            <th>Sabor/Tamaño</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => {
            // Calcular el total de la venta
            const totalVenta = sale.productos.reduce(
              (acc, producto) => acc + producto.cantidad * producto.precio,
              0
            );
  
            return sale.productos.map((producto, index) => (
              <tr key={index}>
                {index === 0 && ( // Solo mostrar el cliente y la fecha en la primera fila
                  <>
                    <td rowSpan={sale.productos.length}>{sale.cliente}</td>
                    <td rowSpan={sale.productos.length}>{sale.fecha}</td>
                    <td rowSpan={sale.productos.length}>{sale.formaPago}</td>
                  </>
                )}
                <td>{producto.nombre}</td>
<td>{producto.variedadNombre}</td>

                <td>{producto.cantidad}</td>
                <td>{formatCurrency(producto.precio)}</td>
                {index === 0 && (
                  <td rowSpan={sale.productos.length}>{formatCurrency(totalVenta)}</td>
                )}
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(sale.id)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(sale.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
  
};

export default SalesList;
