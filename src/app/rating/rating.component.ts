import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ratingcount=0;
  totalrating=0

  Finalrating:any;

  ratingcontrol=new FormControl(0);
  GetRating(){
    this.ratingcount++;
    this.totalrating +=this.ratingcontrol?.value || 0;
    //console.log(this.ratingcontrol.value);
    this.Finalrating= (this.totalrating/this.ratingcount).toFixed(2)
  }

}
