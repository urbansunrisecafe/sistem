import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase importada

const AddNewProduct = () => {
  const [categoria, setCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [variedades, setVariedades] = useState([{ nombre: "", precio: 0, unidadesFinales: 0, unidadesIniciales: 0, receta: { unidadesPorReceta: 1, insumos: [] } }]);
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
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

    fetchInsumos();
  }, []);

  const handleVariedadChange = (index, key, value) => {
    const nuevasVariedades = [...variedades];
    nuevasVariedades[index][key] = value;
    setVariedades(nuevasVariedades);
  };

  const handleInsumoChange = (index, insumoIndex, key, value) => {
    const nuevasVariedades = [...variedades];
    nuevasVariedades[index].receta.insumos[insumoIndex][key] = value;
    setVariedades(nuevasVariedades);
  };

  const agregarVariedad = () => {
    setVariedades([...variedades, { nombre: "", precio: 0, unidadesFinales: 0, unidadesIniciales: 0, receta: { unidadesPorReceta: 1, insumos: [] } }]);
  };

  const agregarInsumo = (index) => {
    const nuevasVariedades = [...variedades];
    nuevasVariedades[index].receta.insumos.push({ insumoId: "", cantidad: 0, unidadDeMedida: "" });
    setVariedades(nuevasVariedades);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const producto = {
        categoria,
        nombre,
        saborTamaño: variedades,
      };

      await addDoc(collection(db, "Productos"), producto);

      console.log("Producto agregado con éxito");

      setCategoria("");
      setNombre("");
      setVariedades([{ nombre: "", precio: 0, unidadesFinales: 0, unidadesIniciales: 0, receta: { unidadesPorReceta: 1, insumos: [] } }]);
    } catch (error) {
      console.error("Error al agregar el producto: ", error);
    }
  };

  return (
    <div>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nombre del producto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {variedades.map((variedad, index) => (
          <div key={index}>
            <h3>Variedad {index + 1}</h3>
            <label>Nombre de la variedad:</label>
            <input
              type="text"
              value={variedad.nombre}
              onChange={(e) => handleVariedadChange(index, "nombre", e.target.value)}
              required
            />
            <label>Precio:</label>
            <input
              type="number"
              value={variedad.precio}
              onChange={(e) => handleVariedadChange(index, "precio", parseFloat(e.target.value))}
              required
            />
            <label>Unidades Iniciales:</label>
            <input
              type="number"
              value={variedad.unidadesIniciales}
              onChange={(e) => handleVariedadChange(index, "unidadesIniciales", parseInt(e.target.value))}
              required
            />
            <label>Unidades Finales:</label>
            <input
              type="number"
              value={variedad.unidadesFinales}
              onChange={(e) => handleVariedadChange(index, "unidadesFinales", parseInt(e.target.value))}
              required
            />
            <h4>Receta</h4>
            <label>Unidades por Receta:</label>
            <input
              type="number"
              value={variedad.receta.unidadesPorReceta}
              onChange={(e) => handleVariedadChange(index, "receta", { ...variedad.receta, unidadesPorReceta: parseInt(e.target.value) })}
              required
            />
            {variedad.receta.insumos.map((insumo, insumoIndex) => (
              <div key={insumoIndex}>
                <label>Insumo ID:</label>
                <input
                  type="text"
                  list={`insumos-list-${index}-${insumoIndex}`}
                  value={insumo.insumoId}
                  onChange={(e) => handleInsumoChange(index, insumoIndex, "insumoId", e.target.value)}
                  required
                />
                <datalist id={`insumos-list-${index}-${insumoIndex}`}>
                  {insumos.map((insumoOption) => (
                    <option key={insumoOption.id} value={insumoOption.nombre} />
                  ))}
                </datalist>
                <label>Cantidad:</label>
                <input
                  type="number"
                  value={insumo.cantidad}
                  onChange={(e) => handleInsumoChange(index, insumoIndex, "cantidad", parseFloat(e.target.value))}
                  required
                />
                <label>Unidad de Medida:</label>
                <input
                  type="text"
                  value={insumo.unidadDeMedida}
                  onChange={(e) => handleInsumoChange(index, insumoIndex, "unidadDeMedida", e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => agregarInsumo(index)}>Agregar Insumo</button>
          </div>
        ))}
        <button type="button" onClick={agregarVariedad}>Agregar Variedad</button>
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default AddNewProduct;
