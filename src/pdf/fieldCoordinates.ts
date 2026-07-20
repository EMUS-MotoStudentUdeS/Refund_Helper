export type TextFieldPlacement={x:number;y:number;width:number;fontSize:number;maxFontSize?:number;minFontSize?:number;align?:'left'|'center'|'right';height?:number;lines?:number};
export type CheckboxPlacement={x:number;y:number;size:number};
export type Placement=TextFieldPlacement|CheckboxPlacement;
export const fieldCoordinates={
 groupName:{x:177,y:693,width:181,fontSize:10,minFontSize:7},
 groupTechnical:{x:69,y:671,size:10},groupAgeg:{x:225,y:671,size:10},groupPromo:{x:345,y:671,size:10},groupPromoCsg:{x:449,y:671,size:10},
 reimburseTo:{x:177,y:635,width:181,fontSize:10,minFontSize:7},methodAccesd:{x:381,y:637,size:10},methodCheque:{x:381,y:622,size:10},
 contact:{x:177,y:592,width:181,fontSize:10,minFontSize:7},phone:{x:438,y:592,width:110,fontSize:10,minFontSize:7},email:{x:177,y:572,width:156,fontSize:10,minFontSize:7},
 amount:{x:214,y:532,width:61,fontSize:11,align:'right' as const},
 purchaseFundraising:{x:220,y:483,size:10},purchaseRevenue:{x:220,y:464,size:10},purchaseNoRevenue:{x:220,y:445,size:10},purchaseOther:{x:220,y:425,size:10},otherDate:{x:422,y:421,width:125,fontSize:9,align:'center' as const},
 equipment:{x:220,y:389,size:10},computerEquipment:{x:220,y:370,size:10},itemOver2000:{x:220,y:389,size:10},itemOver1500:{x:220,y:370,size:10},
 equipmentLife2:{x:475,y:389,size:10},equipmentLife3:{x:505,y:389,size:10},equipmentLife5:{x:532,y:389,size:10},computerLife2:{x:475,y:370,size:10},computerLife3:{x:505,y:370,size:10},computerLife5:{x:532,y:370,size:10},
 project:{x:212.7,y:334.4,width:181,fontSize:10,minFontSize:7},description:{x:214,y:259,width:333,height:70,lines:3,fontSize:10,minFontSize:7},
 president:{x:214,y:227,width:144,fontSize:9,minFontSize:7},treasurer:{x:395,y:227,width:152,fontSize:9,minFontSize:7},
 presidentSignature:{x:214,y:188,width:144,height:30,fontSize:9},treasurerSignature:{x:395,y:188,width:152,height:30,fontSize:9},
 submittedDate:{x:214,y:151,width:99,fontSize:9,align:'center' as const}
} satisfies Record<string,Placement>;
export const imageToPdf=(imageX:number,imageY:number,imageWidth:number,imageHeight:number,elementHeight=0)=>({x:imageX*(612/imageWidth),y:792-(imageY+elementHeight)*(792/imageHeight)});
