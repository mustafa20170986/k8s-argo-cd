import http from 'k6/http'
import {sleep} from 'k6'

export const options={
    vus: 100,
    duration: '2m',
}

export default function(){
    http.get('http://localhost:8080/get-userdata')
    sleep(0.1)
}