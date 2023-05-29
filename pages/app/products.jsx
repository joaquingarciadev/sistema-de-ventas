import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";

import MUIDataTable from "mui-datatables";

export default function Products() {
  const [product, setProduct] = useState({
    user_id: "",
    id: 0,
    name: "",
    price: 0,
    stock: 0,
  });
  const [products, setProducts] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  const getProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(allProducts.filter((p) => p.user_id === user.uid));
  };

  const handleDeleteProduct = (id) => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const newProducts = allProducts.filter((product) => product.id !== id);
    localStorage.setItem("products", JSON.stringify(newProducts));
    getProducts();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...product,
      user_id: user.uid,
      id: products[products.length - 1]?.id + 1 || 1,
    };
    addProduct(newProduct);
    e.target.reset();
  };

  const addProduct = (newProduct) => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const newProducts = [...allProducts, newProduct];
    localStorage.setItem("products", JSON.stringify(newProducts));
    getProducts();
  };

  const columns = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "name",
      label: "Producto",
    },
    {
      name: "price",
      label: "Precio",
    },
    {
      name: "stock",
      label: "Stock",
    },
  ];

  const options = {
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "No se encontraron productos",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Productos por página:",
        displayRows: "de",
      },
    },
  };

  return (
    <div className="col">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <label>
              Nombre
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </label>
            <label>
              Precio
              <input
                type="number"
                step="0.01"
                min={0}
                required
                value={product.price || ""}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min={0}
                required
                value={product.stock || ""}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </label>
          </div>
          <button type="submit">Agregar</button>
        </form>
      </div>
      <MUIDataTable
        title={"Productos"}
        data={products}
        columns={[
          ...columns,
          {
            name: "actions",
            label: "Acciones",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <button
                    onClick={() => handleDeleteProduct(tableMeta.rowData[0])}
                  >
                    Eliminar
                  </button>
                );
              },
            },
          },
        ]}
        options={options}
      />
    </div>
  );
}
