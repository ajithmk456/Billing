import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { QuotationComponent } from './quotation/quotation.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'quotation', component: QuotationComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: 'home' } // Wildcard (Handles invalid routes)
];
