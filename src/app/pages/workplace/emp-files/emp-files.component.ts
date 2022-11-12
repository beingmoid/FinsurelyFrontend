import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDetailDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-emp-files',
  templateUrl: './emp-files.component.html',
  styleUrls: ['./emp-files.component.scss']
})
export class EmpFilesComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  constructor() { }

  ngOnInit(): void {
  }

}
