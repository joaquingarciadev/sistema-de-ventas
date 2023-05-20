import React, { useEffect } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
  table: {
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    flexGrow: 1,
    width: "100%",
    padding: "12px",
    borderStyle: "solid",
    borderWidth: 1,
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "12px",
    borderStyle: "solid",
    borderWidth: 1,
  },
});

export default function DocumentPDF({ sale }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Factura</Text>
          <Text>Fecha: {sale.date}</Text>
          <Text>Cliente: {sale.client}</Text>
          <Text>ID: {sale.id}</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Nombre</Text>
              <Text style={styles.tableCell}>Cantidad</Text>
              <Text style={styles.tableCell}>Precio</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
            {sale.products.map((p) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{p.product.name}</Text>
                <Text style={styles.tableCell}>{p.quantity}</Text>
                <Text style={styles.tableCell}>{p.product.price}</Text>
                <Text style={styles.tableCell}>
                  {p.product.price * p.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text>Total: {sale.total}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
