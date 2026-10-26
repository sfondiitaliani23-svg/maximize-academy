import handler from '../../../api/sabey-recommend.js';
import { adapt } from '../../_adapter.js';

export const onRequest = adapt(handler);
