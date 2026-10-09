import test from 'node:test';
import assert from 'node:assert/strict';
import {safeUrl,taskStats} from '../src/model.js';
test('resource links accept web URLs and reject executable schemes',()=>{assert.equal(safeUrl('javascript:alert(1)'),null);assert.equal(safeUrl('data:text/html,test'),null);assert.equal(safeUrl('not a url'),null);assert.equal(safeUrl('https://example.com/docs'),'https://example.com/docs');});
test('overdue excludes completed tasks and tasks due today',()=>{assert.deepEqual(taskStats([{done:false,due:'2026-10-08'},{done:false,due:'2026-10-09'},{done:true,due:'2026-10-01'},{done:false,due:''}],'2026-10-09'),{open:3,completed:1,overdue:1});});
