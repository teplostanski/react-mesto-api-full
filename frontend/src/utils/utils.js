export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://api.w98.link';

export const AUTORIZATION_PARAMS = {
  baseRoute: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  }
}
