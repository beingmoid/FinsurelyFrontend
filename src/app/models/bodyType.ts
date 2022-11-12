export class BodyType{
    id:number;
    name:string;
}
export class PolicyType{
    id:number;
    name:string;
}
export class Service{
    id:number;
    policyTypeId:number;
    name:string;
}