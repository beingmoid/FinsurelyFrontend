import { I } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PolicyType, Service } from 'src/app/models/bodyType';
import { AlertService } from 'src/app/services/alert.service';
import { PolicyTypeService } from 'src/app/services/APIServices/policytype.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  @Input() inputServiceObserver?: Subject<Service>;
  form: FormGroup;
  policyType: PolicyType[];
  filteredPolicyType: Observable<PolicyType[]>;
  id = 0;
  service: Service;
  constructor(private fb: FormBuilder, private _service: PolicyTypeService, private _alertService: AlertService, private _sharedService: SharedService, private _serviceService: ServiceService) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        policyTypeId: [null],
        name: [null, Validators.required],
      }
    )

    if (this.inputServiceObserver) {
      this.inputServiceObserver.subscribe((res) => {
        if (res) {
          this.service = res;
          this.form.patchValue(res);
          this.id = res.id;
        }
      })
    }

    this._service.PolicyTypeObserver$.subscribe((res) => {
      this.policyType = res as PolicyType[];
    }
    );

    this._service.GetPolicyType();

    this.filteredPolicyType = this.form.controls.policyTypeId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(policy => policy ? this._filterPolicyType(policy) : this.policyType?.slice())
    )

  }
  private _filterPolicyType(value: string) {
    if (value) {
      return this.policyType ? this.policyType?.filter(option => option.name?.toLowerCase().includes(value.toString().toLocaleLowerCase())) : [];
    }
  }
  displayPolicyType(id) {
    if (this.policyType && id) {
      return this.policyType.find(x => x.id === id).name;
    }
  }
  onSubmit(formDirective: FormGroupDirective) {
    var data = this.form.value as Service;
    // data.id=parseInt(this.id) ;
    if (this.form.invalid) {
      return;
    }
    else {
      if (this.id > 0) {
        data.id = this.id;
        this._serviceService.UpdateService(this.id, data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Policy Type Updated Successfully.');
            this._serviceService.GetService();
            this._sharedService.formSubmited.next(res);
          }
        })
      }
      else {
        data.id = 0;
        this._serviceService.SaveService(data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Policy Type Inserted Successfully.');
            this._serviceService.GetService();
            this._sharedService.formSubmited.next(res);
          }
        })
      }

    }
  }


}
