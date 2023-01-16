import http from 'node:http';
import * as dotenv from 'dotenv';
import url from 'node:url';
import {v4 as uuidv4, validate as uuidValidate} from 'uuid';
import {checkUser} from './checkObjectUser.js';

dotenv.config();

const bdArray = new Array();


http
    .createServer((request, response) =>{
      const reqUrl = url.parse(request.url).path.replace(/\/$/g, '');
      try{
          switch (true) {
              case reqUrl===process.env.URL_API && request.method===process.env.GET_METHOD && reqUrl.length===process.env.URL_API.length:
              {
                  response.statusCode=200;
                  response.write(JSON.stringify(bdArray));
                  response.end();
                  break;
              }
              case reqUrl===process.env.URL_API && request.method===process.env.POST_METHOD:
              {
                  const body = new Array();
                  request.on('data', (chunk) => {
                      body.push(chunk);
                  }).on('end', () => {
                      let user = JSON.parse(body.join());
                      if (checkUser(user)) {
                          user.id = uuidv4();
                          bdArray.push(user);
                          response.statusCode=201;
                          response.write(JSON.stringify(user));
                          response.end();
                      } else {
                          response.statusCode=400;
                          response.write('check the passed object');
                          response.end();
                      }
                  });
                  break;
              }
              case reqUrl.includes(process.env.URL_API) && request.method===process.env.GET_METHOD && reqUrl.length>process.env.URL_API.length:
              {
                  let id = reqUrl.replace(/.+\//, '');
                  if (uuidValidate(id)) {
                      const user = bdArray.find((el)=>el['id']===id);
                      if (user) {
                          response.statusCode=200;
                          response.write(JSON.stringify(user));
                          response.end();
                      } else {
                          response.statusCode=404;
                          response.write('user is not find');
                          response.end();
                      }
                  } else {
                      response.statusCode=400;
                      response.write('ID is not a uuid, check if the entered ID is correct');
                      response.end();
                  }
                  break;
              }
              case reqUrl.includes(process.env.URL_API) && request.method===process.env.DELETE_METHOD:
              {
                  const id = reqUrl.replace(/.+\//, '');
                  if (uuidValidate(id)) {
                      let userIndex = bdArray.findIndex((el)=>el['id']===id);
                      if (userIndex>=0) {
                          response.statusCode=204;
                          response.write(JSON.stringify(bdArray.splice(userIndex,1))+ ' deleted');
                          response.end();
                      } else {
                          response.statusCode=404;
                          response.write('user is not find');
                          response.end();
                      }
                  } else {
                      response.statusCode=400;
                      response.write('ID is not a uuid, check if the entered ID is correct');
                      response.end();
                  }
                  break;
              }
              case reqUrl.includes(process.env.URL_API) && request.method===process.env.PUT_METHOD:
              {
                  const body = new Array();
                  request.on('data', (chunk) => {
                      body.push(chunk);
                  }).on('end',()=>{
                      const id = reqUrl.replace(/.+\//, '');
                      if (uuidValidate(id)) {
                          let user = JSON.parse(body.join());
                          if (checkUser(user)) {
                              let userIndex = bdArray.findIndex((el)=>el['id']===id);
                              if (userIndex>=0) {
                                  bdArray[userIndex].username = user.username
                                  bdArray[userIndex].age = user.age
                                  bdArray[userIndex].hobbies = user.hobbies
                                  response.statusCode=200;
                                  response.write(JSON.stringify(bdArray[userIndex])+' update');
                                  response.end();
                              } else {
                                  response.statusCode=404;
                                  response.write('user is not find');
                                  response.end();
                              }
                          }else {
                              response.statusCode=400;
                              response.write('check the passed object');
                              response.end();
                          }
                      } else {
                          response.statusCode=400;
                          response.write('ID is not a uuid, check if the entered ID is correct');
                          response.end();
                      }
                  })

                  break;
              }
              default:{
                  response.statusCode=404;
                  response.write('is not valid api');
                  response.end();
                  break;
              }
          }
      }catch (e) {
          response.statusCode(500)
          response.write('Internal error')
          response.end();
      }
    })
    .listen(process.env['PORT'], ()=>console.log(`Server started!`));
