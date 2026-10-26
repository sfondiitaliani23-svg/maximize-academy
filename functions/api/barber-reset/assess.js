import handler from '../../../api/barber-reset.js';
import { adapt } from '../../_adapter.js';

export const onRequest = adapt(handler);
