export function safeUrl(value) {
 try {const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:null;} catch{return null;}
}
export function taskStats(tasks, today) {
 return {open:tasks.filter(t=>!t.done).length,completed:tasks.filter(t=>t.done).length,overdue:tasks.filter(t=>!t.done&&t.due&&t.due<today).length};
}
