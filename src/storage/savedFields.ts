import type { ReimbursementData } from '../types/reimbursement';
export const STORAGE_KEY='refund-helper-saved-v1';
export const SAVED_KEYS:(keyof ReimbursementData)[]=['groupName','groupType','reimburseTo','refundMethod','contact','phone','email','project','president','treasurer'];
export const saveFields=(data:ReimbursementData,storage:Storage=localStorage)=>{if(!data.remember){storage.removeItem(STORAGE_KEY);return;}const saved=Object.fromEntries(SAVED_KEYS.map(k=>[k,data[k]]));storage.setItem(STORAGE_KEY,JSON.stringify(saved));};
export const loadFields=(storage:Storage=localStorage):Partial<ReimbursementData>=>{try{return JSON.parse(storage.getItem(STORAGE_KEY)||'{}')}catch{return{}}};
export const clearSavedFields=(storage:Storage=localStorage)=>storage.removeItem(STORAGE_KEY);
