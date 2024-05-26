import { createBullBoard } from '@bull-board/api';
import { KoaAdapter } from '@bull-board/koa';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { q } from './q';

const serverAdapter = new KoaAdapter();

serverAdapter.setBasePath('/board');

const bullBoard = createBullBoard({
    queues: [new BullAdapter(q)],
    serverAdapter: serverAdapter,
  });


export { serverAdapter, bullBoard }