import test from 'node:test';
import assert from 'node:assert/strict';
import {schedule} from '../src/events.ts';
import rows from '../src/data/events.example.json' with {type:'json'};

const event = day => ({...rows[0], status:'published', startsAt:day+'T12:00:00Z', endsAt:undefined});
test('drafts stay private', () => assert.deepEqual(schedule(rows.filter(e => e.status === 'draft')), {upcoming:[],past:[]}));
test('events sort on each side of now', () => {
  const days = ['2030-05-04','2030-05-01','2030-05-03','2030-05-02'];
  const {upcoming,past} = schedule(days.map(event), Date.parse('2030-05-03T00:00:00Z'));
  assert.deepEqual(upcoming.map(e=>e.startsAt.slice(0,10)),days.slice(2,3).concat(days[0]));
  assert.deepEqual(past.map(e=>e.startsAt.slice(0,10)),[days[3],days[1]]);
});
test('ongoing meetup stays upcoming', () => assert.equal(schedule([{...event('2030-05-01'),endsAt:'2030-05-02T12:00:00Z'}],Date.parse('2030-05-02T01:00:00Z')).upcoming.length,1));
test('invalid dates and links fail the build', () => {
  assert.throws(()=>schedule([event('invalid')]));
  assert.throws(()=>schedule([{...event('2030-05-01'),registrationUrl:'javascript:void(0)'}]));
});
test('registration and sponsor are optional', () => assert.equal(schedule([{...event('2030-05-01'),registrationUrl:undefined,sponsor:undefined}],0).upcoming.length,1));

