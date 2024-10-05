import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const unidadesDeMedida = [
  { nombre: "Bolsa", valor: "bolsa" },
  { nombre: "Quintal", valor: "quintal" },
  { nombre: "Caja", valor: "caja" },
  { nombre: "Botella", valor: "botella" },
  { nombre: "Kilo", valor: "kilo" },
  { nombre: "Litro", valor: "litro" },
];

const unidadesContenidoNeto = [
  { nombre: "Kilogramo (kg)", valor: "kg" },
  { nombre: "Gramo (g)", valor: "g" },
  { nombre: "Litro (l)", valor: "l" },
  { nombre: "Mililitro (ml)", valor: "ml" },
  { nombre: "Unidad (u)", valor: "u" },
];

const AddPurchase = () => {
  const [proveedor, setProveedor] = useState("");
  const [insumos, setInsumos] = useState([
    {
      categoria: "",
      nombre: "",
      cantidad: 1,
      unidadDeMedida: "",
      contenidoNetoUnitario: "",
      unidadDeMedidaContenidoNetoUnitario: "",
    },
  ]);
  const [categorias, setCategorias] = useState([]);

  const fetchInsumos = async () => {
    const insumosCollection = collection(db, "Insumos");
    const insumosSnapshot = await getDocs(insumosCollection);
    const insumosList = insumosSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
      categoria: doc.data().categoria,
    }));

    const categoriasMap = insumosList.reduce((acc, insumo) => {
      if (!acc[insumo.categoria]) {
        acc[insumo.categoria] = [];
      }
      acc[insumo.categoria].push(insumo);
      return acc;
    }, {});

    setCategorias(categoriasMap);
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const handleAddInsumo = () => {
    setInsumos([
      ...insumos,
      {
        categoria: "",
        nombre: "",
        cantidad: 1,
        unidadDeMedida: "",
        contenidoNetoUnitario: "",
        unidadDeMedidaContenidoNetoUnitario: "",
      },
    ]);
  };

  const handleInputChange = (index, event) => {
    const values = [...insumos];
    const { name, value } = event.target;

    if (name === "categoria") {
      values[index] = { ...values[index], categoria: value, nombre: "" };
    } else if (name === "nombre") {
      values[index] = { ...values[index], nombre: value };
    } else {
      values[index][name] = value;
    }

    setInsumos(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const insumo of insumos) {
        await addDoc(collection(db, "Compras"), {
          proveedor,
          fecha: new Date().toLocaleString(),
          ...insumo,
        });
      }

      setProveedor("");
      setInsumos([
        {
          categoria: "",
          nombre: "",
          cantidad: 1,
          unidadDeMedida: "",
          contenidoNetoUnitario: "",
          unidadDeMedidaContenidoNetoUnitario: "",
        },
      ]);
    } catch (e) {
      console.error("Error al registrar la compra: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-sale">
      <div className="form-group">
        <label>Proveedor:</label>
        <input
          type="text"
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value)}
          required
        />
      </div>

      {insumos.map((insumo, index) => (
        <div key={index} className="form-group">
          <div className="form-group">
            <label>Categoría:</label>
            <select
              name="categoria"
              value={insumo.categoria}
              onChange={(e) => handleInputChange(index, e)}
              required
            >
              <option value="">Seleccione una categoría</option>
              {Object.keys(categorias).map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {insumo.categoria && (
            <div className="form-group">
              <label>Insumo:</label>
              <select
                name="nombre"
                value={insumo.nombre}
                onChange={(e) => handleInputChange(index, e)}
                required
              >
                <option value="">Seleccione un insumo</option>
                {categorias[insumo.categoria]?.map((insumo) => (
                  <option key={insumo.id} value={insumo.nombre}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              value={insumo.cantidad}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
          </div>

          <div className="form-group">
            <label>Unidad de Medida:</label>
            <select
              name="unidadDeMedida"
              value={insumo.unidadDeMedida}
              onChange={(e) => handleInputChange(index, e)}
              required
            >
              <option value="">Seleccione una unidad de medida</option>
              {unidadesDeMedida.map((unidad) => (
                <option key={unidad.valor} value={unidad.valor}>
                  {unidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Contenido Neto Unitario:</label>
            <input
              type="number"
              name="contenidoNetoUnitario"
              value={insumo.contenidoNetoUnitario}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
          </div>

          <div className="form-group">
            <label>Unidad de Medida Contenido Neto:</label>
            <select
              name="unidadDeMedidaContenidoNetoUnitario"
              value={insumo.unidadDeMedidaContenidoNetoUnitario}
              onChange={(e) => handleInputChange(index, e)}
              required
            >
              <option value="">Seleccione una unidad de medida</option>
              {unidadesContenidoNeto.map((unidad) => (
                <option key={unidad.valor} value={unidad.valor}>
                  {unidad.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="form-group">
        <button type="button" onClick={handleAddInsumo}>
          Agregar insumo
        </button>
      </div>

      <div className="form-group">
        <button type="submit">Registrar compra</button>
      </div>
    </form>
  );
};

export default AddPurchase;
