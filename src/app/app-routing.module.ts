import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { ListingComponent } from './listing/listing.component';
import { RatingComponent } from './rating/rating.component';

const routes: Routes = [
  {component:ListingComponent,path:""},
  {component:CreateinvoiceComponent,path:"createinvoice"},
  {component:CreateinvoiceComponent,path:"editinvoice/:invoiceno"},
  {component:RatingComponent,path:"rating"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
