import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddProduction = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [variedadSeleccionada, setVariedadSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(0);

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

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleProductoChange = (e) => {
    const productoId = e.target.value;
    setProductoSeleccionado(productoId);
    const producto = productos.find((p) => p.id === productoId);
    if (producto?.variedades.length === 1) {
      setVariedadSeleccionada(0);
    } else {
      setVariedadSeleccionada("");
    }
  };

  const handleVariedadChange = (e) => {
    setVariedadSeleccionada(e.target.value);
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productoRef = doc(db, "Productos", productoSeleccionado);
      const productoSnapshot = await getDoc(productoRef);

      if (!productoSnapshot.exists()) {
        throw new Error("El producto seleccionado no existe.");
      }

      const productoData = productoSnapshot.data();
      const variedadSeleccionadaObj = productoData.saborTamaño[variedadSeleccionada];
      const cantidadNumero = parseInt(cantidad, 10);

      if (isNaN(cantidadNumero) || cantidadNumero <= 0) {
        throw new Error("La cantidad debe ser un número válido mayor que cero.");
      }

      const nuevasUnidadesIniciales = variedadSeleccionadaObj.unidadesIniciales + cantidadNumero;
      const nuevasUnidadesFinales = variedadSeleccionadaObj.unidadesFinales + cantidadNumero;

      const nuevasVariedades = [...productoData.saborTamaño];
      nuevasVariedades[variedadSeleccionada] = {
        ...variedadSeleccionadaObj,
        unidadesIniciales: nuevasUnidadesIniciales,
        unidadesFinales: nuevasUnidadesFinales,
      };

      await updateDoc(productoRef, {
        saborTamaño: nuevasVariedades,
      });

      const fechaRegistro = new Date().toLocaleString();

      // Registrar en la colección Proyecciones y guardar el ID
      const proyeccionRef = await addDoc(collection(db, "Proyecciones"), {
        productoId: productoSeleccionado,
        variedad: variedadSeleccionadaObj.nombre,
        fechaRegistro,
        fechaEliminacion: null,
        cantidadProducida: nuevasUnidadesIniciales,
        cantidadVendida: 0,
        cantidadRestante: nuevasUnidadesFinales,
      });

      // Guardar el ID del documento de Proyección en el producto
      nuevasVariedades[variedadSeleccionada] = {
        ...nuevasVariedades[variedadSeleccionada],
        proyeccionId: proyeccionRef.id,
      };

      await updateDoc(productoRef, {
        saborTamaño: nuevasVariedades,
      });

      setProductoSeleccionado("");
      setVariedadSeleccionada("");
      setCantidad(0);
      alert("Producción registrada exitosamente.");
      await fetchProductos();
    } catch (error) {
      console.error("Error al registrar la producción: ", error);
      alert("Ocurrió un error al registrar la producción: " + error.message);
    }
  };

  const handleResetUnidades = async () => {
    try {
      const productoRef = doc(db, "Productos", productoSeleccionado);
      const productoSnapshot = await getDoc(productoRef);

      if (!productoSnapshot.exists()) {
        throw new Error("El producto seleccionado no existe.");
      }

      const productoData = productoSnapshot.data();
      const variedadSeleccionadaObj = productoData.saborTamaño[variedadSeleccionada];
      const fechaEliminacion = new Date().toLocaleString();

      // Actualizar el documento de Proyección existente
      if (variedadSeleccionadaObj.proyeccionId) {
        const proyeccionRef = doc(db, "Proyecciones", variedadSeleccionadaObj.proyeccionId);
        await updateDoc(proyeccionRef, {
          fechaEliminacion,
        });
      } else {
        throw new Error("No se encontró el ID de proyección para esta variedad.");
      }

      const nuevaVariedad = {
        ...variedadSeleccionadaObj,
        unidadesIniciales: 0,
        unidadesFinales: 0,
      };

      const nuevasVariedades = [...productoData.saborTamaño];
      nuevasVariedades[variedadSeleccionada] = nuevaVariedad;

      await updateDoc(productoRef, {
        saborTamaño: nuevasVariedades,
      });

      alert("Unidades reiniciadas y datos registrados exitosamente.");
      await fetchProductos();
    } catch (error) {
      console.error("Error al reiniciar las unidades: ", error);
      alert("Ocurrió un error al reiniciar las unidades: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Producto:
        <select
          value={productoSeleccionado}
          onChange={handleProductoChange}
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </label>

      {productoSeleccionado && (
        <label>
          Variedad:
          <select
            value={variedadSeleccionada}
            onChange={handleVariedadChange}
            required
          >
            <option value="">Seleccione una variedad</option>
            {productos
              .find((producto) => producto.id === productoSeleccionado)
              ?.variedades.map((variedad, index) => (
                <option key={index} value={index}>
                  {variedad.nombre} (Unidades Finales:{" "}
                  {variedad.unidadesFinales})
                </option>
              ))}
          </select>
        </label>
      )}

      {variedadSeleccionada !== "" && (
        <label>
          Cantidad a producir:
          <input
            type="number"
            value={cantidad}
            onChange={handleCantidadChange}
            min="1"
            required
          />
        </label>
      )}

      <button type="submit">Registrar Producción</button>

      {productoSeleccionado && (
        <button type="button" onClick={handleResetUnidades}>
          Reiniciar Unidades
        </button>
      )}
    </form>
  );
};

export default AddProduction;
