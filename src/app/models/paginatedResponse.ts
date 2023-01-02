export class PaginatedData<T>{
  data:T[];
  totalPages:number;
  totalCount:number;
  pdfFileUrl: string;
  excelFileUrl: string;
  totalBalance: number;

}

export class PaginationParams<TKey>{
  id:TKey;
  from:Date;
  to : Date;
  brannchId:number;
  searchQuery: string;
  itemsPerPage: number =10;
  page: number =1;
  requestExcel: boolean;
  pdfFileUrl:string
  excelFileUrl:string;
  requestPdf: boolean;
  requestAllData: boolean;

}
