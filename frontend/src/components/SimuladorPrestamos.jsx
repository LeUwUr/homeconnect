import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./SimuladorPrestamos.css";

const SimuladorPrestamos = () => {
  const [form, setForm] = useState({
    valorPropiedad: "",
    tasaInteres: "",
    plazo: "",
    montoSolicitado: "",
  });

  const [results, setResults] = useState({
    cuotaMensual: "---",
    limitePrestamo: "---",
    cuotaMensualSinIntereses: "---", // Nuevo campo
  });

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Evitar valores negativos en tasaInteres y plazo
    if ((id === "tasaInteres" || id === "plazo") && value < 0) {
      return; // No hacer nada si el valor es negativo
    }

    // Eliminar comas del valor para mantener el estado limpio
    let cleanedValue = value.replace(/,/g, "");

    setForm((prev) => ({
      ...prev,
      [id]: cleanedValue,
    }));
  };

  // Función para formatear los números con comas
  const formatNumber = (number) => {
    return number && !isNaN(number)
      ? new Intl.NumberFormat("en-US").format(number)
      : "";
  };

  // Función para realizar el cálculo del préstamo
  const calcularPrestamo = () => {
    const { valorPropiedad, tasaInteres, plazo, montoSolicitado } = form;

    if (!valorPropiedad || !tasaInteres || !plazo || !montoSolicitado) {
      alert("Por favor, completa todos los campos con valores válidos.");
      return;
    }

    const tasaMensual = parseFloat(tasaInteres) / 100 / 12;
    const numeroPagos = parseInt(plazo) * 12;

    const cuotaMensual =
      (parseFloat(montoSolicitado) * tasaMensual) /
      (1 - Math.pow(1 + tasaMensual, -numeroPagos));

    const cuotaMensualSinIntereses = parseFloat(montoSolicitado) / numeroPagos;
    const limitePrestamo = parseFloat(valorPropiedad) * 0.8;

    setResults({
      cuotaMensual: `$${cuotaMensual.toFixed(2)}`,
      cuotaMensualSinIntereses: `$${cuotaMensualSinIntereses.toFixed(2)}`,
      limitePrestamo: `$${formatNumber(limitePrestamo)}`,
      desgloseMensual: Array.from({ length: 12 }, (_, index) => ({
        mes: index + 1,
        monto: cuotaMensual.toFixed(2),
      })),
    });
  };

  // Función para generar el PDF con los resultados
  const generarPDF = () => {
    const doc = new jsPDF();
  
    // Título y diseño general
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Reporte de Simulación de Préstamo", 105, 15, { align: "center" });
    doc.line(20, 20, 190, 20); // Línea debajo del título
  
    // Sección de información general
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Detalles del Préstamo:", 20, 30);
  
    const { valorPropiedad, tasaInteres, plazo, montoSolicitado } = form;
    const { cuotaMensual, limitePrestamo } = results;
  
    doc.text(`Valor de la Propiedad: $${formatNumber(valorPropiedad)}`, 20, 40);
    doc.text(`Monto Solicitado: $${formatNumber(montoSolicitado)}`, 20, 50);
    doc.text(`Tasa de Interés: ${tasaInteres}%`, 20, 60);
    doc.text(`Plazo: ${plazo} años`, 20, 70);
    doc.text(`Cuota Mensual: ${cuotaMensual}`, 20, 80);
    doc.text(`Límite del Préstamo: ${limitePrestamo}`, 20, 90);
  
    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 95, 190, 95);
  
    // Cálculo del desglose mensual
    doc.setFont("helvetica", "bold");
    doc.text("Desglose de Pagos (Primeros 12 Meses):", 20, 105);
  
    const tasaMensual = parseFloat(tasaInteres) / 100 / 12;
    let saldoRestante = parseFloat(montoSolicitado);
  
    // Encabezado de la tabla con color
    const headerY = 115;
    doc.setFillColor(230, 230, 250); // Color de fondo (lavanda)
    doc.rect(20, headerY - 7, 170, 10, "F"); // Rectángulo del encabezado
  
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Mes", 25, headerY);
    doc.text("Capital", 60, headerY);
    doc.text("Interés", 100, headerY);
    doc.text("Saldo Restante", 140, headerY);
  
    // Datos de la tabla con filas alternadas de color
    doc.setFont("helvetica", "normal");
    let currentY = headerY + 5;
    for (let mes = 1; mes <= 12; mes++) {
      const interesMes = saldoRestante * tasaMensual;
      const capitalMes = parseFloat(cuotaMensual.replace("$", "")) - interesMes;
      saldoRestante -= capitalMes;
  
      // Fondo alternado para filas
      if (mes % 2 === 0) {
        doc.setFillColor(245, 245, 245); // Gris claro
        doc.rect(20, currentY - 5, 170, 10, "F"); // Rectángulo de fondo
      }
  
      // Imprimir datos en la fila
      doc.setTextColor(0, 0, 0); // Texto negro
      doc.text(`${mes}`, 25, currentY);
      doc.text(`$${capitalMes.toFixed(2)}`, 60, currentY);
      doc.text(`$${interesMes.toFixed(2)}`, 100, currentY);
      doc.text(`$${saldoRestante.toFixed(2)}`, 140, currentY);
  
      currentY += 10; // Incrementar posición Y para la siguiente fila
    }
  
    // Bordes alrededor de la tabla
    doc.setDrawColor(200, 200, 200); // Gris claro
    doc.rect(20, headerY - 7, 170, (currentY - headerY) - 5, "S");
  
    // Footer del PDF
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Reporte generado automáticamente con Simulador de Préstamos",
      105,
      280,
      { align: "center" }
    );
  
    doc.save("detalles_prestamo.pdf");
  };

  return (
    <div className="container">
      <h1>Simulador de Préstamos</h1>
      <form>
        <label htmlFor="valorPropiedad">Valor de la Propiedad:</label>
        <input
          type="text"
          id="valorPropiedad"
          value={formatNumber(form.valorPropiedad)}
          onChange={handleInputChange}
          placeholder="Ingresa el valor de la propiedad"
        />

        <label htmlFor="tasaInteres">Tasa de Interés (%):</label>
        <input
          type="number"
          id="tasaInteres"
          value={form.tasaInteres}
          onChange={handleInputChange}
          placeholder="Ingresa la tasa de interés"
        />

        <label htmlFor="plazo">Plazo (años):</label>
        <input
          type="number"
          id="plazo"
          value={form.plazo}
          onChange={handleInputChange}
          placeholder="Ingresa el plazo en años"
        />

        <label htmlFor="montoSolicitado">Monto Solicitado:</label>
        <input
          type="text"
          id="montoSolicitado"
          value={formatNumber(form.montoSolicitado)}
          onChange={handleInputChange}
          placeholder="Ingresa el monto solicitado"
        />

        <button type="button" onClick={calcularPrestamo}>
          Calcular
        </button>
      </form>

      <div className="results">
        <p>
          <strong>Cuota Mensual:</strong> {results.cuotaMensual}
        </p>
        <p>
          <strong>Cuota Mensual (sin intereses):</strong> {results.cuotaMensualSinIntereses}
        </p>
        <p>
          <strong>Límite del Préstamo:</strong> {results.limitePrestamo}
        </p>

        <button type="button" onClick={generarPDF}>
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default SimuladorPrestamos;