import http from '@/axios/http.ts'
export function getMessage(data:object) {
    return http({
      url: '/open/v2/text',
      method: 'POST',
      responseType: 'stream',
      data
    })
  }