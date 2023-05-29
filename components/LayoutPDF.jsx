import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    alignItems: "center",
    height: 40,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "12px",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 20,
  },
  totalLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  totalValue: {
    fontWeight: "bold",
  },
});

export default function LayoutPDF({ data }) {
  const { sale } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Detalle de venta</Text>
          <Text style={styles.subtitle}>Fecha: {sale.date}</Text>
          <Text style={styles.subtitle}>Cliente: {sale.client}</Text>
          <Text style={styles.subtitle}>ID: {sale.id}</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerCell]}>
              <Text style={[styles.tableCell, styles.headerCell]}>Nombre</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Cantidad</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Precio</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Total</Text>
            </View>
            {sale.products.map((p) => (
              <View style={styles.tableRow} key={p.product.id}>
                <Text style={styles.tableCell}>{p.product.name}</Text>
                <Text style={styles.tableCell}>{p.quantity}</Text>
                <Text style={styles.tableCell}>{p.product.price}</Text>
                <Text style={styles.tableCell}>
                  {p.product.price * p.quantity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{sale.total}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
