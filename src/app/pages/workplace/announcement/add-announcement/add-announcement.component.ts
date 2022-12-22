import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss']
})
export class AddAnnouncementComponent implements OnInit {
form: FormGroup;

  constructor(private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: [null, Validators.required],
        jobTitle: [null,Validators.required],
        title: [null, Validators.required],
        date: [null, Validators.required],
        description: [null, Validators.required] 
      }
    )
  }

  onSubmit(formDirective: FormGroupDirective) {
    
  }
}
