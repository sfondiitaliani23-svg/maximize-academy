import handler from '../../api/push.js';
import { adapt } from '../_adapter.js';

export const onRequest = adapt(handler);
