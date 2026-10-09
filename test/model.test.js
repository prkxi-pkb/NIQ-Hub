import test from 'node:test';
import assert from 'node:assert/strict';
import {safeUrl,taskStats} from '../src/model.js';
test('resource links accept web URLs and reject executable schemes',()=>{assert.equal(safeUrl('javascript:alert(1)'),null);assert.equal(safeUrl('data:text/html,test'),null);assert.equal(safeUrl('not a url'),null);assert.equal(safeUrl('https://example.com/docs'),'https://example.com/docs');});
test('overdue excludes completed tasks and tasks due today',()=>{assert.deepEqual(taskStats([{done:false,due:'2026-10-08'},{done:false,due:'2026-10-09'},{done:true,due:'2026-10-01'},{done:false,due:''}],'2026-10-09'),{open:3,completed:1,overdue:1});});

import {filterTasks,validateBackup,updateEntry} from '../src/model.js';
const tasks=[{id:'a',title:'Review',owner:'Sam',program:'Launch',due:'2026-10-08',done:false},{id:'b',title:'Publish',owner:'Kim',program:'Launch',due:'2026-10-09',done:false},{id:'c',title:'Archive',owner:'Sam',program:'Ops',due:'2026-10-08',done:true}];
test('task filters combine status, program and search',()=>{
 assert.deepEqual(filterTasks(tasks,{status:'overdue',program:'Launch',query:'sam'},'2026-10-09').map(t=>t.id),['a']);
 assert.deepEqual(filterTasks(tasks,{status:'today'},'2026-10-09').map(t=>t.id),['b']);
 assert.deepEqual(filterTasks(tasks,{status:'completed'},'2026-10-09').map(t=>t.id),['c']);
});
const data={programs:[{id:'p',title:'Launch',description:'Release',status:'Planning'}],tasks,resources:[{id:'r',title:'Docs',url:'https://example.com',category:'Guide'}]};
test('backup roundtrip preserves all entries',()=>assert.deepEqual(validateBackup(JSON.parse(JSON.stringify({version:1,data}))),data));
test('invalid backups reject dangerous URLs, duplicates, invalid dates and statuses',()=>{
 for(const mutate of [d=>d.resources[0].url='javascript:alert(1)',d=>d.resources[0].id='a',d=>d.tasks[0].due='2026-02-30',d=>d.tasks[0].done='false',d=>d.programs[0].status='unknown']){
 const invalid=structuredClone(data);mutate(invalid);assert.throws(()=>validateBackup(invalid));
 }
 assert.throws(()=>validateBackup({version:2,data}));
});
test('editing programs updates task associations without changing original state',()=>{
 const result=updateEntry(data,'programs',{...data.programs[0],title:'Release'});
 assert.equal(result.tasks[0].program,'Release');assert.equal(data.tasks[0].program,'Launch');
 const edited=updateEntry(data,'tasks',{...tasks[2],title:'Archived'});assert.equal(edited.tasks[2].done,true);assert.equal(edited.tasks.length,3);
});
