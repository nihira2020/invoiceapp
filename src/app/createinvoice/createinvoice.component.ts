import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from '../service/master.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.css']
})
export class CreateinvoiceComponent implements OnInit {

  constructor(private builder: FormBuilder, private service: MasterService, private router: Router, private alert: ToastrService,
    private activeroute: ActivatedRoute) { }
  pagetitle = "Create Invoice"
  invoicedetail !: FormArray<any>;
  invoiceproduct !: FormGroup<any>;

  mastercustomer: any;
  masterproduct: any;
  editinvoiceno: any;
  isedit = false;
  editinvdetail: any;

  ngOnInit(): void {
    this.GetCustomers();
    this.GetProducts();

    this.editinvoiceno = this.activeroute.snapshot.paramMap.get('invoiceno');
    if (this.editinvoiceno != null) {
      this.pagetitle = "Edit Invoice";
      this.isedit = true;
      this.SetEditInfo(this.editinvoiceno);
    }

  }

  invoiceform = this.builder.group({
    invoiceNo: this.builder.control('', Validators.required),
    customerId: this.builder.control('', Validators.required),
    customerName: this.builder.control(''),
    deliveryAddress: this.builder.control(''),
    remarks: this.builder.control(''),
    total: this.builder.control({ value: 0, disabled: true }),
    tax: this.builder.control({ value: 0, disabled: true }),
    netTotal: this.builder.control({ value: 0, disabled: true }),
    details: this.builder.array([])

  });

  SetEditInfo(invoiceno: any) {
    this.service.GetInvDetailbycode(invoiceno).subscribe(res => {
      this.editinvdetail = res;
      for (let i = 0; i < this.editinvdetail.length; i++) {
        this.addnewproduct();
      };
    });

    this.service.GetInvHeaderbycode(invoiceno).subscribe(res => {
      let editdata: any;
      editdata = res;
      if (editdata != null) {
        this.invoiceform.setValue({
          invoiceNo: editdata.invoiceNo, customerId: editdata.customerId,
          customerName: editdata.customerName, deliveryAddress: editdata.deliveryAddress, remarks: editdata.remarks,
          total: editdata.total, tax: editdata.tax, netTotal: editdata.netTotal, details: this.editinvdetail
        })
      }
    });
  }


  SaveInvoice() {
    if (this.invoiceform.valid) {
      this.service.SaveInvoice(this.invoiceform.getRawValue()).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          if(this.isedit){
            this.alert.success('Updated Successfully.', 'Invoice :' + result.kyValue);
          }else{
          this.alert.success('Created Successfully.', 'Invoice :' + result.kyValue);
          }
          this.router.navigate(['/']);
        } else {
          this.alert.error('Failed to save.', 'Invoice');
        }
      });
    } else {
      this.alert.warning('Please enter values in all mandatory filed', 'Validation');
    }

  }

  addnewproduct() {
    this.invoicedetail = this.invoiceform.get("details") as FormArray;

    let customercode = this.invoiceform.get("customerId")?.value;
    if ((customercode != null && customercode != '')  || this.isedit) {
      this.invoicedetail.push(this.Generaterow());
    } else {
      this.alert.warning('Please select the customer', 'Validation');
    }
  }

  get invproducts() {
    return this.invoiceform.get("details") as FormArray;
  }

  Generaterow() {
    return this.builder.group({
      invoiceNo: this.builder.control(''),
      productCode: this.builder.control('', Validators.required),
      productName: this.builder.control(''),
      qty: this.builder.control(1),
      salesPrice: this.builder.control(0),
      total: this.builder.control({ value: 0, disabled: true })
    });
  }


  GetCustomers() {
    this.service.GetCustomer().subscribe(res => {
      this.mastercustomer = res;
    })
  }

  GetProducts() {
    this.service.GetProducts().subscribe(res => {
      this.masterproduct = res;
    })
  }

  customerchange() {
    let customercode = this.invoiceform.get("customerId")?.value;
    this.service.GetCustomerbycode(customercode).subscribe(res => {
      let custdata: any;
      custdata = res;
      if (custdata != null) {
        this.invoiceform.get("deliveryAddress")?.setValue(custdata.address + ',' + custdata.phoneno + ',' + custdata.email);
        this.invoiceform.get("customerName")?.setValue(custdata.name);
      }
    });
  }

  productchange(index: any) {
    this.invoicedetail = this.invoiceform.get("details") as FormArray;
    this.invoiceproduct = this.invoicedetail.at(index) as FormGroup;
    let productcode = this.invoiceproduct.get("productCode")?.value;
    this.service.GetProductbycode(productcode).subscribe(res => {
      let proddata: any;
      proddata = res;
      console.log(proddata);
      if (proddata != null) {
        this.invoiceproduct.get("productName")?.setValue(proddata.name);
        this.invoiceproduct.get("salesPrice")?.setValue(proddata.price);
        this.Itemcalculation(index);
      }
    });
  }

  Itemcalculation(index: any) {
    this.invoicedetail = this.invoiceform.get("details") as FormArray;
    this.invoiceproduct = this.invoicedetail.at(index) as FormGroup;
    let qty = this.invoiceproduct.get("qty")?.value;
    let price = this.invoiceproduct.get("salesPrice")?.value;
    let total = qty * price;
    this.invoiceproduct.get("total")?.setValue(total);

    this.summarycalculation();
  }
  Removeproduct(index: any){
    if(confirm('Do you want to remove?')){
      this.invproducts.removeAt(index);
      this.summarycalculation();

    }
  }

  summarycalculation() {
    let array = this.invoiceform.getRawValue().details;
    let sumtotal = 0
    array.forEach((x: any) => {
      sumtotal = sumtotal + x.total;
    });

    // tax calculation
    let sumtax = (7 / 100) * sumtotal;
    let nettotal = sumtotal + sumtax;

    this.invoiceform.get("total")?.setValue(sumtotal);
    this.invoiceform.get("tax")?.setValue(sumtax);
    this.invoiceform.get("netTotal")?.setValue(nettotal);
  }



}
