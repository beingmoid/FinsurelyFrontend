import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-loans',
  templateUrl: './add-loans.component.html',
  styleUrls: ['./add-loans.component.scss']
})
export class AddLoansComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],


    })
  }

  onSubmit(formDirective: FormGroupDirective) {
    
  }

}
