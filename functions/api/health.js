import handler from '../../api/health.js';
import { adapt } from '../_adapter.js';

export const onRequest = adapt(handler);
