import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import Combobox from "@/components/Combobox";

import MUIDataTable from "mui-datatables";

export default function AddSale() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [sale, setSale] = useState({
    user_id: "",
    id: 0,
    date: "",
    client: "",
    products: [],
    total: 0,
  });
  const [product, setProduct] = useState({
    product: {
      user_id: "",
      id: 0,
      name: "",
      price: 0,
      stock: 0,
    },
    quantity: 0,
    total: 0,
  });
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      getProducts();
      getSales();
    }
  }, [user]);

  useEffect(() => {
    const total = sale.products.reduce((acc, curr) => acc + curr.total, 0);
    setSale({ ...sale, total });
  }, [sale.products]);

  useEffect(() => {
    const total = product.quantity * product.product.price;
    setProduct({ ...product, total });
  }, [product.quantity]);

  const getProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(allProducts.filter((p) => p.user_id === user.uid));
    setProductsFiltered(
      allProducts.filter((p) => p.user_id === user.uid && p.stock > 0)
    );
  };

  const getSales = () => {
    const allSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(allSales.filter((s) => s.user_id === user.uid));
  };

  const handleAddProduct = () => {
    if (product.product.name === "") {
      alert("Ingrese un producto válido");
      return;
    }

    // Add the product to the sale, if it already exists, update the quantity and total
    const sameProduct = sale.products.find(
      (p) =>
        p.product.id === product.product.id &&
        p.product.name === product.product.name
    );
    if (sameProduct) {
      const newProducts = sale.products.map((p) => {
        if (p.product.id === product.product.id) {
          return {
            ...p,
            quantity: p.quantity + product.quantity,
            total: (p.quantity + product.quantity) * product.price,
          };
        }
        return p;
      });
      setSale({ ...sale, products: newProducts });
    } else {
      setSale({
        ...sale,
        products: [...sale.products, product],
      });
    }

    // Remove the product from the products list
    setProductsFiltered(
      productsFiltered.filter((p) => p.id !== product.product.id)
    );

    setProduct({
      product: {
        user_id: "",
        id: 0,
        name: "",
        price: 0,
        stock: 0,
      },
      quantity: 0,
      total: 0,
    });
  };

  const handleDeleteProduct = (id) => {
    // Remove the product from the sale
    const newProducts = sale.products.filter((p) => p.product.id !== id);
    setSale({ ...sale, products: newProducts });

    // Bring the product back to the products list
    const sameProduct = products.find((p) => p.id === id);
    setProductsFiltered(
      [...productsFiltered, sameProduct].sort((a, b) => a.id - b.id)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sale.products.length === 0) {
      alert("Ingrese al menos un producto");
      return;
    }
    const newSale = {
      ...sale,
      user_id: user.uid,
      id: sales.length + 1,
      date: new Date().toLocaleDateString(),
    };
    addSale(newSale);

    setSale({
      user_id: "",
      id: 0,
      date: "",
      client: "",
      products: [],
      total: 0,
    });
    setProduct({
      product: {
        user_id: "",
        id: 0,
        name: "",
        price: 0,
        stock: 0,
      },
      quantity: 0,
      total: 0,
    });
  };

  const addSale = (newSale) => {
    const allSales = JSON.parse(localStorage.getItem("sales")) || [];
    localStorage.setItem("sales", JSON.stringify([...allSales, newSale]));

    // Update the stock of the products
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const newProducts = allProducts.map((p) => {
      const sameProduct = newSale.products.find((s) => s.product.id === p.id);
      if (sameProduct) {
        return {
          ...p,
          stock: p.stock - sameProduct.quantity,
        };
      }
      return p;
    });
    localStorage.setItem("products", JSON.stringify(newProducts));
    getSales();
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
      name: "quantity",
      label: "Cantidad",
    },
    {
      name: "price",
      label: "Precio",
    },
    {
      name: "total",
      label: "Total",
    },
    {
      name: "actions",
      label: "Acciones",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              onClick={() => {
                handleDeleteProduct(tableMeta.rowData[0]);
              }}
            >
              Quitar
            </button>
          );
        },
      },
    },
  ];

  const options = {
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    rowsPerPage: 100,
    pagination: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "No se encontraron productos",
      },
    },
  };

  return (
    <>
      <div className="col">
        <div className="grid">
          <div className="card">
            <form onSubmit={handleSubmit}>
              <label>
                Cliente
                <input
                  type="text"
                  required
                  value={sale.client}
                  onChange={(e) => setSale({ ...sale, client: e.target.value })}
                />
              </label>
              <label>
                Total
                <input type="number" value={sale.total || ""} readOnly />
              </label>
              <button type="submit">Agregar venta</button>
            </form>
          </div>
          <div className="card">
            <form>
              <div>
                <label>Producto</label>
                <Combobox
                  options={productsFiltered.map((p) => ({
                    value: p.id,
                    label: p.id + " - " + p.name,
                  }))}
                  onChange={(option) => {
                    const sameProduct = products.find(
                      (p) => p.id === option.value
                    );
                    setProduct({
                      ...product,
                      product: {
                        user_id: sameProduct.uid,
                        id: sameProduct.id,
                        name: sameProduct.name,
                        price: sameProduct.price,
                        stock: sameProduct.stock,
                      },
                      quantity: 1,
                    });
                  }}
                  reset={product.product.name === ""}
                />
              </div>
              <label>
                Cantidad
                <input
                  type="number"
                  min={1}
                  max={product.product.stock}
                  value={product.quantity || ""}
                  onChange={(e) => {
                    if (product.product.name === "") return;
                    setProduct({
                      ...product,
                      quantity: parseInt(e.target.value),
                    });
                  }}
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  value={product.product.price || ""}
                  readOnly
                />
              </label>
              <button type="button" onClick={handleAddProduct}>
                Añadir producto
              </button>
            </form>
          </div>
        </div>
        <MUIDataTable
          title="Productos"
          data={sale.products.map((p) => ({
            id: p.product.id,
            name: p.product.name,
            quantity: p.quantity,
            price: p.product.price,
            total: p.total,
          }))}
          columns={columns}
          options={options}
        />
      </div>
    </>
  );
}
