import React, { useEffect, useState } from "react";
import { getAllFoods } from "../services/foodService";

const MenuPage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFoods();
      setFoods(data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍔 Danh sách món ăn</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {foods.map((food) => (
          <div key={food._id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center"
          }}>
            <img
              src={food.image}
              alt={food.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3>{food.name}</h3>
            <p>{food.description}</p>
            <strong>{food.price.toLocaleString()}đ</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
