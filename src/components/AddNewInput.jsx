import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase importada

const AddNewInput = () => {
  const [bulkData, setBulkData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir el texto a un array de objetos
      const insumos = JSON.parse(bulkData);

      // Validar que sea un array
      if (!Array.isArray(insumos)) {
        throw new Error("El formato ingresado no es válido");
      }

      // Insertar cada ingrediente en Firestore
      for (const ing of insumos) {
        await addDoc(collection(db, "Insumos"), ing);
      }

      console.log("insumos agregados con éxito");

      // Limpiar el campo de texto
      setBulkData("");
    } catch (error) {
      console.error("Error al agregar los insumos: ", error);
    }
  };

  return (
    <div>
      <h2>Agregar insumos en Masa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ingresar insumos (formato JSON):</label>
          <textarea
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            placeholder={`[{"nombre": "Harina", "cantidad": 100, "unidad": "Kg"}, {"nombre": "Azúcar", "cantidad": 50, "unidad": "Kg"}]`}
            rows="10"
            cols="50"
            required
          ></textarea>
        </div>
        <button type="submit">Agregar Insumos</button>
      </form>
    </div>
  );
};

export default AddNewInput;
