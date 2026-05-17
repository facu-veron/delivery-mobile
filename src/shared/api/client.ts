import axios from 'axios';
import SuperTokens from 'supertokens-react-native';

import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

SuperTokens.addAxiosInterceptors(apiClient);
