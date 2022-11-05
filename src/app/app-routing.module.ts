import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { ListingComponent } from './listing/listing.component';

const routes: Routes = [
  {component:ListingComponent,path:""},
  {component:CreateinvoiceComponent,path:"createinvoice"},
  {component:CreateinvoiceComponent,path:"editinvoice/:invoiceno"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
