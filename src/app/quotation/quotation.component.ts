import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {
  date: string = '';
  vehicleNumber: string = '';
  workDetails: string = '';
  costBreakdown: string = '';
  letterheadBase64: string = '';
  sealSignatureBase64: string = '';

  constructor() {
    this.convertImagesToBase64();
  }

  convertImagesToBase64() {
    this.convertImageToBase64('assets/letterhead.jpg', (base64) => {
      this.letterheadBase64 = base64;
    });

    this.convertImageToBase64('assets/seal-signature.jpg', (base64) => {
      this.sealSignatureBase64 = base64;
    });
  }

  convertImageToBase64(imagePath: string, callback: (base64: string) => void) {
    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        callback(canvas.toDataURL('image/png')); // Convert to Base64
      }
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; // Format: DD.MM.YYYY
  }

  generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(this.letterheadBase64, 'JPEG', 0, 0, 210, 297); // A4 dimensions
  
    pdf.setFont('helvetica', 'bold'); // Set font to Helvetica (supports bullet points)
    pdf.setFontSize(14);
  
    // Convert all text to uppercase
    const upperCaseDate = this.formatDate(this.date).toUpperCase();
    const upperCaseVehicle = this.vehicleNumber.toUpperCase();
    const upperCaseWorkDetails = this.workDetails.toUpperCase();
    const upperCaseCostBreakdown = this.costBreakdown.toUpperCase();
  
    // Vehicle Number
    pdf.text(`VEHICLE NUMBER: ${upperCaseVehicle}`, 20, 80);
  
    // Date (Formatted as DD.MM.YYYY, placed below the vehicle number)
    pdf.text(`DATE: ${upperCaseDate}`, 20, 90);
  
    // Work Details Section
    pdf.text('WORK DETAILS:', 20, 110);
    pdf.setFontSize(12);
    const workLines = upperCaseWorkDetails
      .split('\n')
      .map(line => `• ${line.trim()}`)
      .filter(line => line.length > 2); // Remove empty lines
    pdf.text(workLines, 25, 120, { maxWidth: 170 });
  
    // Cost Breakdown Section
    pdf.setFontSize(14);
    pdf.text('COST BREAKDOWN:', 20, 150);
    pdf.setFontSize(12);
    const costLines = upperCaseCostBreakdown
      .split('\n')
      .map(line => `• ${line.trim()}`)
      .filter(line => line.length > 2); // Remove empty lines
    pdf.text(costLines, 25, 160, { maxWidth: 170 });
  
    // Payment Terms
    pdf.setFontSize(14);
    pdf.text('PAYMENT TERMS:', 20, 200);
    pdf.setFontSize(12);
    pdf.text('• GST @18% EXTRA.', 25, 210);
  
    // Move Seal & Signature to the left side
    if (this.sealSignatureBase64) {
      pdf.addImage(this.sealSignatureBase64, 'PNG', 30, 230, 50, 20); // Adjusted x-position to move left
    }
  
    // Set filename as "quotation-[vehicle number].pdf"
    const fileName = `QUOTATION-${upperCaseVehicle}.PDF`;
    pdf.save(fileName);
  }
  
  
}
