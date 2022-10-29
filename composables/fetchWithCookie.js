import { appendHeader } from 'h3';

export const fetchWithCookie = async (url, options) => {
  const event = useRequestEvent();
  const res = await $fetch.raw(url, options);
  const cookies = (res.headers.get('set-cookie') || '').split(',');

  for (const cookie of cookies) {
    appendHeader(event, 'set-cookie', cookie);
  }

  return res._data;
};
