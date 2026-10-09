export function safeUrl(value) {
 try {const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:null;} catch{return null;}
}
export function taskStats(tasks, today) {
 return {open:tasks.filter(t=>!t.done).length,completed:tasks.filter(t=>t.done).length,overdue:tasks.filter(t=>!t.done&&t.due&&t.due<today).length};
}

export function filterTasks(tasks, {status='all', program='', query=''}={}, today) {
 return tasks.filter(t=>
  (status==='all'||(status==='open'&&!t.done)||(status==='completed'&&t.done)||(status==='overdue'&&!t.done&&t.due&&t.due<today)||(status==='today'&&!t.done&&t.due===today))&&
  (!program||t.program===program)&&
  [t.title,t.owner,t.program,t.due].some(v=>String(v??'').toLowerCase().includes(query.toLowerCase()))
 );
}
export function validateBackup(input) {
 const data=input?.version===1?input.data:input;
 if(!data||!['programs','tasks','resources'].every(k=>Array.isArray(data[k])))throw new Error('Choose a valid NIQ Hub backup.');
 const output={programs:[],tasks:[],resources:[]};
 const ids=new Set();
 const string=(value,required=false)=>{if(typeof value!=='string'||value.length>500||(required&&!value.trim()))throw new Error('Backup contains invalid text fields.');return value;};
 for(const type of Object.keys(output)){
  if(data[type].length>10000)throw new Error('Backup contains too many entries.');
  for(const row of data[type]){
   if(!row||typeof row!=='object')throw new Error('Backup contains an invalid entry.');
   const item={id:string(row.id,true),title:string(row.title,true)};
   if(ids.has(item.id))throw new Error('Backup contains duplicate entry IDs.');ids.add(item.id);
   if(type==='programs'){item.description=string(row.description);if(!['Planning','In progress','On hold','Completed'].includes(row.status))throw new Error('Invalid program status.');item.status=row.status;}
   if(type==='tasks'){item.owner=string(row.owner);item.program=string(row.program);item.due=string(row.due);if(item.due&&(!/^\d{4}-\d{2}-\d{2}$/.test(item.due)||!Number.isFinite(Date.parse(item.due))||new Date(item.due).toISOString().slice(0,10)!==item.due))throw new Error('Invalid task date.');if(typeof row.done!=='boolean')throw new Error('Invalid task completion status.');item.done=row.done;}
   if(type==='resources'){item.url=string(row.url,true);if(!safeUrl(item.url))throw new Error('Resource URLs must use http or https.');item.category=string(row.category);}
   output[type].push(item);
  }
 }
 return output;
}
export function updateEntry(state,type,item) {
 const previous=state[type].find(x=>x.id===item.id);
 const result={...state,[type]:previous?state[type].map(x=>x.id===item.id?{...x,...item}:x):[...state[type],item]};
 if(type==='programs'&&previous&&previous.title!==item.title)result.tasks=state.tasks.map(t=>t.program===previous.title?{...t,program:item.title}:t);
 return result;
}
