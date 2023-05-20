import { useEffect, useState } from "react";

import Combobox from "@/components/Combobox";

import MUIDataTable from "mui-datatables";

export default function AddSale() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sale, setSale] = useState({
    date: "",
    id: 0,
    client: "",
    products: [],
    total: 0,
  });
  const [saleProduct, setSaleProduct] = useState({
    product: {
      id: 0,
      name: "",
      price: 0,
      stock: 0,
    },
    quantity: 0,
    total: 0,
  });
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsDropdown, setProductsDropdown] = useState([]);

  useEffect(() => {
    const getProducts = () => {
      localStorage.getItem("products") &&
        setProducts(JSON.parse(localStorage.getItem("products")));
    };
    const getSales = () => {
      localStorage.getItem("sales") &&
        setSales(JSON.parse(localStorage.getItem("sales")));
    };
    getProducts();
    getSales();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sales", JSON.stringify(sales));
      localStorage.setItem("products", JSON.stringify(products));

      setProductsDropdown(products.filter((p) => p.stock > 0));
    }
  }, [isLoaded, sales, products]);

  useEffect(() => {
    const total = sale.products.reduce((acc, curr) => acc + curr.total, 0);
    setSale({ ...sale, total });
  }, [sale.products]);

  useEffect(() => {
    const total = saleProduct.quantity * saleProduct.product.price;
    setSaleProduct({ ...saleProduct, total });
  }, [saleProduct.quantity]);

  const handleAddProduct = () => {
    if (saleProduct.name === "") {
      alert("Ingrese un producto válido");
      return;
    }
    const sameProduct = sale.products.find(
      (p) =>
        p.product.id === saleProduct.product.id &&
        p.product.name === saleProduct.product.name
    );
    if (sameProduct) {
      const newProducts = sale.products.map((p) => {
        if (p.product.id === saleProduct.product.id) {
          return {
            ...p,
            quantity: p.quantity + saleProduct.quantity,
            total: (p.quantity + saleProduct.quantity) * saleProduct.price,
          };
        }
        return p;
      });
      setSale({ ...sale, products: newProducts });
    } else {
      setSale({ ...sale, products: [...sale.products, saleProduct] });
    }
    setProductsDropdown(
      productsDropdown.filter((p) => p.id !== saleProduct.product.id)
    );
    setSaleProduct({
      product: { id: 0, name: "", price: 0, stock: 0 },
      quantity: 0,
      total: 0,
    });
  };

  const handleDeleteProduct = (id) => {
    const newProducts = sale.products.filter((p) => p.product.id !== id);
    setSale({ ...sale, products: newProducts });

    const sameProduct = products.find((p) => p.id === id);
    const sortedProducts = [...productsDropdown, sameProduct].sort(
      (a, b) => a.id - b.id
    );
    setProductsDropdown(sortedProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sale.total === 0) {
      alert("Ingrese al menos un producto");
      return;
    }
    const date = new Date().toLocaleDateString();
    const id = sales.length + 1;
    const newSale = { ...sale, date, id };
    setSales([...sales, newSale]);

    const newProducts = products.map((product) => {
      const sameProduct = sale.products.find(
        (p) => p.product.id === product.id
      );
      if (sameProduct) {
        return {
          ...product,
          stock: product.stock - sameProduct.quantity,
        };
      }
      return product;
    });
    setProducts(newProducts);

    setSale({
      date: "",
      id: 0,
      client: "",
      products: [],
      total: 0,
    });
    setSaleProduct({
      product: { id: 0, name: "", price: 0, stock: 0 },
      quantity: 0,
      total: 0,
    });
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
                  options={productsDropdown.map((p) => ({
                    value: p.id,
                    label: p.id + " - " + p.name,
                  }))}
                  onChange={(option) => {
                    const product = products.find((p) => p.id === option.value);
                    setSaleProduct({
                      ...saleProduct,
                      product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                      },
                      quantity: 1,
                    });
                  }}
                />
              </div>
              <label>
                Cantidad
                <input
                  type="number"
                  min={1}
                  max={saleProduct.product.stock}
                  value={saleProduct.quantity || ""}
                  onChange={(e) =>
                    setSaleProduct({
                      ...saleProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  value={saleProduct.product.price || ""}
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
