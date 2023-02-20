import axios from 'axios'

const baseURL='http://localhost:3001'
export function uploadFile(url,formData,onUploadProgress=()=>{}){
  return axios({
    method:'post',
    url,
    baseURL,
    headers:{
      'Content-Type':'multipart/form-data'
    },
    data:formData,
    onUploadProgress
  })
}

export function mergeChunks(url,data){
  return axios({
    method:'post',
    url,
    data,
    baseURL,
    headers:{
      'Content-Type':'application/json'
    }
  })
}