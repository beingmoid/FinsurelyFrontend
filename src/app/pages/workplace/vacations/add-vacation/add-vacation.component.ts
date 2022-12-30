import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vacation',
  templateUrl: './add-vacation.component.html',
  styleUrls: ['./add-vacation.component.scss']
})
export class AddVacationComponent implements OnInit {
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
