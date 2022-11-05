import { Component, OnInit } from '@angular/core';
import { MasterService } from '../service/master.service';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  constructor(private service: MasterService, private alert: ToastrService, private router: Router) { }

  Invoiceheader: any;

  ngOnInit(): void {
    this.LoadInvoice();
  }

  LoadInvoice() {
    this.service.GetAllInvoice().subscribe(res => {
      this.Invoiceheader = res;
    });
  }

  invoiceremove(invoiceno: any) {
    if (confirm('Do you want to remove this Invoice :' + invoiceno)) {
      this.service.RemoveInvoice(invoiceno).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.LoadInvoice();
        } else {
          this.alert.error('Failed to Remove.', 'Invoice');
        }
      });
    }
  }

  Editinvoice(invoiceno: any) {
    this.router.navigateByUrl('/editinvoice/' + invoiceno);
  }

}
