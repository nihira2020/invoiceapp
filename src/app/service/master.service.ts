import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  GetCustomer() {
    return this.http.get('https://localhost:7118/Customer/GetAll');
  }
  GetCustomerbycode(code: any) {
    return this.http.get('https://localhost:7118/Customer/GetByCode?Code='+code);
  }
  GetProducts() {
    return this.http.get('https://localhost:7118/Product/GetAll');
  }
  GetProductbycode(code: any) {
    return this.http.get('https://localhost:7118/Product/GetByCode?Code='+code);
  }

  GetAllInvoice(){
    return this.http.get('https://localhost:7118/Invoice/GetAllHeader');
  }

  GetInvHeaderbycode(invoiceno:any){
    return this.http.get('https://localhost:7118/Invoice/GetAllHeaderbyCode?invoiceno='+invoiceno);
  }
  GetInvDetailbycode(invoiceno:any){
    return this.http.get('https://localhost:7118/Invoice/GetAllDetailbyCode?invoiceno='+invoiceno);
  }
  RemoveInvoice(invoiceno:any){
    return this.http.delete('https://localhost:7118/Invoice/Remove?invoiceno='+invoiceno);
  }

  SaveInvoice(invoicedata:any){
    return this.http.post('https://localhost:7118/Invoice/Save',invoicedata);
  }

  GenerateInvoicePDF(invoiceno:any){
    return this.http.get('https://localhost:7118/Invoice/generatepdf?InvoiceNo='+invoiceno,{observe:'response',responseType:'blob'});
    
  }



}
