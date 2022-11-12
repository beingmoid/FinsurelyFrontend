import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { LoaderService } from 'src/app/services/loader.service'
@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
 
})
export class StatementComponent implements OnInit {
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

  }
  isTableExpanded=false;
  constructor(private routes:ActivatedRoute
    ,private _router:Router,
    private service:AccountsService,
   private loader:LoaderService) { }
  accountId:number;
    isloading=false;
    collapse=false;
  datefrom:Date;
  dateTo:Date;
  statement=[];
  ngOnInit(): void {
    this.routes.queryParams.subscribe(async params => {

      this.accountId=+params['accountId'] || 0;
      console.log(this.accountId)
      // if(!this.accountId){
      //   this._router.navigate(['/accounting'])
      // }

  this.isloading=true;
      this.loader.loaderSubject.next(true);

      this.service.AccountStatement(this.accountId).subscribe(res=>{
        if(res.isSuccessfull){
          this.statement= res.dynamicResult as []
          console.log(this.statement);
          this.loader.loaderSubject.next(false);
          this.isloading=false
        }
      });

    });
  }
  swtich(){
    console.log('swtced')
    this.collapse=!this.collapse;
  }
  Back(){
    this._router.navigate(['/accounting'])
  }
  RunReport(){
    this.isloading=true;
    this.loader.loaderSubject.next(true);
    setTimeout(()=>{
      this.loader.loaderSubject.next(false);
    },3000)
    this.isloading=false;
  }

}
