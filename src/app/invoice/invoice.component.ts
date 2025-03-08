import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class InvoiceComponent {
  invoiceNumber: string = 'INV-001';
  date: string = new Date().toISOString().split('T')[0];
  billTo: string = ''; // Updated from customerName

  items: any[] = [{ name: '', hsn: '', quantity: 1, price: 0, cgst: 9, sgst: 9 }];

  addItem() {
    this.items.push({ name: '', hsn: '', quantity: 1, price: 0, cgst: 9, sgst: 9 });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  calculateAmount(item: any): number {
    const taxableAmount = item.quantity * item.price;
    const cgst = (taxableAmount * item.cgst) / 100;
    const sgst = (taxableAmount * item.sgst) / 100;
    return taxableAmount + cgst + sgst;
  }

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + this.calculateAmount(item), 0);
  }

  generatePDF() {
    const doc = new jsPDF();
  
    doc.text('Invoice', 10, 10);
    doc.text(`Invoice Number: ${this.invoiceNumber}`, 10, 20);
    doc.text(`Date: ${this.date}`, 10, 30);
    doc.text(`Bill To:`, 10, 40);
    doc.text(`${this.billTo}`, 10, 50);
  
    const tableData = this.items.map((item, index) => [
      index + 1,
      item.name,
      item.hsn,
      item.quantity,
      item.price,
      item.quantity * item.price,
      `${item.cgst}% (${(item.quantity * item.price * item.cgst) / 100})`,
      `${item.sgst}% (${(item.quantity * item.price * item.sgst) / 100})`,
      this.calculateAmount(item)
    ]);
  
    // ✅ Call autoTable without expecting a return value
    autoTable(doc, {
      head: [['S.NO', 'Item Name', 'HSN/SAC', 'Quantity', 'Price/Unit', 'Taxable Amount', 'CGST', 'SGST', 'Amount']],
      body: tableData,
      startY: 60,
    });
  
    // ✅ Get the final Y position safely
    const finalY = (doc as any).lastAutoTable?.finalY || 80;
  
    doc.text(`Total: ${this.calculateTotal()}`, 10, finalY + 10);
    doc.save(`invoice-${this.invoiceNumber}.pdf`);
  }
  
  
  
}

