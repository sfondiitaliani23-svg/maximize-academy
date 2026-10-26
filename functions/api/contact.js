import handler from '../../api/contact.js';
import { adapt } from '../_adapter.js';

export const onRequest = adapt(handler);
