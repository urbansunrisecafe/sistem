import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddProductVariety = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedProductoId, setSelectedProductoId] = useState("");
  const [newVariety, setNewVariety] = useState({
    nombre: "",
    precio: 0,
    unidadesFinales: 0,
    unidadesIniciales: 0,
    receta: {
      unidadesPorReceta: 1,
      insumos: [],
    },
  });
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);

        // Obtener categorías únicas de los productos
        const categoriasData = [...new Set(productosData.map((producto) => producto.categoria))];
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener los productos: ", error);
      }
    };

    const fetchInsumos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Insumos"));
        const insumosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInsumos(insumosData);
      } catch (error) {
        console.error("Error al obtener los insumos: ", error);
      }
    };

    fetchProductos();
    fetchInsumos();
  }, []);

  const handleVariedadChange = (key, value) => {
    setNewVariety((prevVariety) => ({
      ...prevVariety,
      [key]: value,
    }));
  };

  const handleInsumoChange = (insumoIndex, key, value) => {
    const newInsumos = [...newVariety.receta.insumos];
    newInsumos[insumoIndex][key] = value;
    setNewVariety((prevVariety) => ({
      ...prevVariety,
      receta: {
        ...prevVariety.receta,
        insumos: newInsumos,
      },
    }));
  };

  const agregarInsumo = () => {
    setNewVariety((prevVariety) => ({
      ...prevVariety,
      receta: {
        ...prevVariety.receta,
        insumos: [...prevVariety.receta.insumos, { insumoId: "", cantidad: 0, unidadDeMedida: "" }],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductoId) {
      console.error("No se ha seleccionado un producto");
      return;
    }

    try {
      const productoRef = doc(db, "Productos", selectedProductoId);

      // Actualizar el producto con la nueva variedad
      await updateDoc(productoRef, {
        saborTamaño: [...productos.find((p) => p.id === selectedProductoId).saborTamaño, newVariety],
      });

      console.log("Variedad agregada con éxito");

      // Limpiar los campos
      setSelectedCategoria("");
      setSelectedProductoId("");
      setNewVariety({
        nombre: "",
        precio: 0,
        unidadesFinales: 0,
        unidadesIniciales: 0,
        receta: {
          unidadesPorReceta: 1,
          insumos: [],
        },
      });
    } catch (error) {
      console.error("Error al agregar la variedad: ", error);
    }
  };

  return (
    <div>
      <h2>Agregar Nueva Variedad a un Producto Existente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Seleccionar Categoría:</label>
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
        {selectedCategoria && (
          <div>
            <label>Seleccionar Producto:</label>
            <select
              value={selectedProductoId}
              onChange={(e) => setSelectedProductoId(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productos
                .filter((producto) => producto.categoria === selectedCategoria)
                .map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
            </select>
          </div>
        )}
        <div>
          <h3>Nueva Variedad</h3>
          <label>Nombre de la variedad:</label>
          <input
            type="text"
            value={newVariety.nombre}
            onChange={(e) => handleVariedadChange("nombre", e.target.value)}
            required
          />
          <label>Precio:</label>
          <input
            type="number"
            value={newVariety.precio}
            onChange={(e) => handleVariedadChange("precio", parseFloat(e.target.value))}
            required
          />
          <label>Unidades Iniciales:</label>
          <input
            type="number"
            value={newVariety.unidadesIniciales}
            onChange={(e) => handleVariedadChange("unidadesIniciales", parseInt(e.target.value))}
            required
          />
          <label>Unidades Finales:</label>
          <input
            type="number"
            value={newVariety.unidadesFinales}
            onChange={(e) => handleVariedadChange("unidadesFinales", parseInt(e.target.value))}
            required
          />
          <h4>Receta</h4>
          <label>Unidades por Receta:</label>
          <input
            type="number"
            value={newVariety.receta.unidadesPorReceta}
            onChange={(e) =>
              setNewVariety((prevVariety) => ({
                ...prevVariety,
                receta: { ...prevVariety.receta, unidadesPorReceta: parseInt(e.target.value) },
              }))
            }
            required
          />
          {newVariety.receta.insumos.map((insumo, insumoIndex) => (
            <div key={insumoIndex}>
              <label>Insumo ID:</label>
              <input
                type="text"
                list={`insumos-list-${insumoIndex}`}
                value={insumo.insumoId}
                onChange={(e) => handleInsumoChange(insumoIndex, "insumoId", e.target.value)}
                required
              />
              <datalist id={`insumos-list-${insumoIndex}`}>
                {insumos.map((insumoOption) => (
                  <option key={insumoOption.id} value={insumoOption.nombre} />
                ))}
              </datalist>
              <label>Cantidad:</label>
              <input
                type="number"
                value={insumo.cantidad}
                onChange={(e) => handleInsumoChange(insumoIndex, "cantidad", parseFloat(e.target.value))}
                required
              />
              <label>Unidad de Medida:</label>
              <input
                type="text"
                value={insumo.unidadDeMedida}
                onChange={(e) => handleInsumoChange(insumoIndex, "unidadDeMedida", e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={agregarInsumo}>Agregar Insumo</button>
        </div>
        <button type="submit">Agregar Variedad</button>
      </form>
    </div>
  );
};

export default AddProductVariety;
