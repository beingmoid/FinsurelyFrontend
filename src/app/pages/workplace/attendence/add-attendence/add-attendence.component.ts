import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-add-attendence',
  templateUrl: './add-attendence.component.html',
  styleUrls: ['./add-attendence.component.scss']
})
export class AddAttendenceComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective) {
    
  }
}
