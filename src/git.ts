// import axios from 'axios'

const GITHUB_API_URL = 'https://api.github.com'
export const api = (
  token: string,
  headerOpts: { [k: string]: string } = {}
) => {
  const headerDefaults = {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(token && { Authorization: `token ${token}` }),
    },
  }
  headerOpts = Object.assign({}, headerDefaults, headerOpts)
  //   axios.create({
  //     baseURL: GITHUB_API_URL,
  //     headerOpts,
  //   })
}
