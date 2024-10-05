import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PurchasesList = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const purchasesCollection = collection(db, "Compras");
      const purchasesSnapshot = await getDocs(purchasesCollection);
      const purchasesList = purchasesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPurchases(purchasesList);
    };

    fetchPurchases();
  }, []);

  return (
    <div>
      <h1>Registro de Compras</h1>
      <ul>
        {purchases.map((purchase) => (
          <li key={purchase.id}>
            Proveedor: {purchase.proveedor} - Total: {purchase.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchasesList;
