import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import Modal from "@/components/Modal";
import LayoutPDF from "@/components/LayoutPDF";
import { FileText, Download } from "@/public/icons";

import MUIDataTable from "mui-datatables";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState({
    id: 0,
    date: "",
    client: "",
    products: [],
    total: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthContext();

  // This code uses the useState hook to set the value of the isClient variable to true. It then uses the useEffect hook to set the value of the isClient variable to true when the component is mounted.
  // I used this code to solve the problem of the PDF not being generated on the server side.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user) {
      getSales();
    }
  }, [user]);

  const getSales = () => {
    const allSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(allSales.filter((s) => s.user_id === user.uid));
  };

  const handleClick = (id) => {
    const sale = sales.find((sale) => sale.id === id);
    setSale(sale);
    setShowModal(true);
  };

  const columns = [
    {
      name: "date",
      label: "Fecha",
    },
    {
      name: "id",
      label: "ID",
    },
    {
      name: "client",
      label: "Cliente",
    },
    {
      name: "total",
      label: "Total",
    },
  ];

  const options = {
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "No se encontraron ventas",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Ventas por página:",
        displayRows: "de",
      },
    },
  };

  const columnsTableModal = [
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
      name: "quantity",
      label: "Cantidad",
    },
    {
      name: "total",
      label: "Total",
    },
  ];

  const optionsTableModal = {
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
      <MUIDataTable
        title={"Ventas"}
        data={sales}
        columns={[
          ...columns,
          {
            name: "actions",
            label: "Acciones",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <li onClick={() => handleClick(tableMeta.rowData[1])}>
                    <FileText />
                  </li>
                );
              },
              print: false,
              download: false,
              filter: false,
              sort: false,
            },
          },
        ]}
        options={options}
      />
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="col">
          <div className="space-between">
            <h3>Detalle de venta</h3>
            {isClient && (
              <PDFDownloadLink
                document={
                  <LayoutPDF
                    data={{
                      sale,
                    }}
                  />
                }
                fileName="document.pdf"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    "Cargando documento..."
                  ) : (
                    <button>
                      Descargar <Download />
                    </button>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
          <div className="col">
            <div className="row">
              <div className="col">
                <label>
                  Fecha:
                  <input type="text" value={sale.date} readOnly />
                </label>
                <label>
                  ID:
                  <input type="text" value={sale.id} readOnly />
                </label>
              </div>
              <div className="col">
                <label>
                  Cliente:
                  <input type="text" value={sale.client} readOnly />
                </label>
                <label>
                  Total:
                  <input type="text" value={sale.total} readOnly />
                </label>
              </div>
            </div>
            <MUIDataTable
              title={"Productos"}
              data={sale.products.map((p) => {
                return {
                  id: p.product.id,
                  name: p.product.name,
                  price: p.product.price,
                  quantity: p.quantity,
                  total: p.total,
                };
              })}
              columns={columnsTableModal}
              options={optionsTableModal}
            />
          </div>
          <div className="space-between">
            <span></span>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
