export const parseAmount = (value:string):number => Number(value.trim().replace(/\s/g,'').replace(',','.'));
export const formatCurrency = (value:string|number):string => { const n=typeof value==='number'?value:parseAmount(value); return Number.isFinite(n)?n.toFixed(2).replace('.',','):''; };
export const formatDate = (value:string):string => { if(!value) return ''; const [y,m,d]=value.split('-'); return y&&m&&d?`${d}/${m}/${y}`:value; };
export const sanitizeFilename = (value:string):string => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[<>:"/\\|?*\x00-\x1F]/g,'').trim().replace(/\s+/g,'_').replace(/\.+$/,'') || 'Groupe';
export const normalizeEmail = (value:string):string => { const clean=value.trim(); if(!clean) return ''; const local=clean.split('@')[0]; return `${local}@usherbrooke.ca`; };
export const todayIso = () => new Date().toISOString().slice(0,10);
