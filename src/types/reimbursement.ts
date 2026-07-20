export type PurchaseType = 'fundraising'|'revenue'|'noRevenue'|'other';
export type GroupType = 'technical'|'ageg'|'promo'|'promoCsg';
export type RefundMethod = 'accesd'|'cheque';
export type Life = ''|'2'|'3'|'5';
export interface ReimbursementData { groupName:string; groupType:GroupType; reimburseTo:string; refundMethod:RefundMethod; contact:string; phone:string; email:string; amount:string; purchaseTypes:PurchaseType[]; otherDate:string; equipment:boolean; computerEquipment:boolean; itemOver2000:boolean; itemOver1500:boolean; equipmentLife:Life; computerLife:Life; project:string; description:string; president:string; treasurer:string; submittedDate:string; remember:boolean; }
export interface ReceiptItem { id:string; file:File; kind:'pdf'|'image'|'docx'; rotation:number; pages?:number; preview?:string; warning?:string; }
export interface SignatureImages { president?:File; treasurer?:File; }
export type ValidationErrors = Partial<Record<keyof ReimbursementData|'receipts'|'descriptionOverflow',string>>;
