import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDetailDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-emp-status',
  templateUrl: './emp-status.component.html',
  styleUrls: ['./emp-status.component.scss']
})
export class EmpStatusComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  constructor() { }

  ngOnInit(): void {
  }

}
