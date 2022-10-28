'use strict'
const dbUtil = require('../db/utils')
const { customAlphabet } = require('nanoid')
module.exports = async function (fastify, opts) {
  fastify.get('/user/:email', async function (request, reply) {
  try{
    console.log(request.params)
    const {email} = request.params
    if(!email){
      return{error:true,message:'params not present'}
    }
      const phoneQuery = {
      text: 'SELECT email,rank,referralCode FROM(SELECT name,email,referralCode, RANK () over( order by score desc,created_at) rank from users) as t where t.email=$1',
      values:[email]
    }
    console.log('query')
    const phoneQueryResult = await dbUtil.Query(phoneQuery)
    console.log(phoneQueryResult)
    return {data:phoneQueryResult.rows[0] }
  }catch(error){
    console.log(error)
  }
  })



  //post request
  fastify.post('/user',async function(request,reply){
    try{
    const SCORE = 100;
    const {name,email,code} = request.body
if(!request.body.name || !request.body.email){
  return{error:true,message:'missing params'}
}
const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
let randomVal = await nanoId()
const referralCode=`${name.substring(0,3).toUpperCase()}-${randomVal}`;
console.log('generated Referral Code',referralCode)
let insertQuery
 if(!code){ insertQuery ={
   text:'INSERT INTO users(name,email,referralCode,score) VALUES($1,$2,$3,$4)',
   values:[name,email,referralCode,SCORE]
}}
else{
  console.log('else')
  const getQuery = {
    text:'SELECT email from users where referralCode=$1',
    values:[code]
  }
     const getQueryResult = await dbUtil.Query(getQuery)
    
    const referredByEmail = getQueryResult.rows[0].email
     const updateQuery = {
      text:"UPDATE users set score=score+50 where email=$1",
      values:[referredByEmail]
     }
const updateQ =await dbUtil.Query(updateQuery)
console.log('updateQ',updateQ)
     insertQuery ={
   text:'INSERT INTO users(name,email,referralCode,score,referredBy) VALUES($1,$2,$3,$4,$5)',
   values:[name,email,referralCode,SCORE,referredByEmail]
}
}
const insertQueryRes = await dbUtil.Query(insertQuery)
console.log('insert query res',insertQueryRes)
    return {message:'user added to waitlist ',referralCode}
}catch(error){
  console.log(error)
  console.log(typeof error.code)
  if(error.code === '23505'){
    return{error:true,message:'user already exists'}
  }
  return{error:true}
}})


  fastify.patch('/user/:email',async function(request, reply){
    const {email} = request.params;
    const {shareChannel} = request.body;
    console.log(email)
    console.log(shareChannel)
    console.log(!(shareChannel ==='IG' || shareChannel ==='FB' || shareChannel ==='TW' || shareChannel === 'WA'))
    if(!email || !shareChannel || !(shareChannel ==='IG' || shareChannel ==='FB' || shareChannel ==='TW' || shareChannel === 'WA')){
      return{error:true,message:'required params are missing'}
    }
    let channelMap ={
      IG:'ig_share',
      WA:'whatsapp_share',
      TW:'tw_share',
      FB:'fb_share'
    }
const getQuery = {
  text:`SELECT ${channelMap[shareChannel]} from users where email=$1`,
  values:[email]
}

const getQueryResult =await dbUtil.Query(getQuery)
console.log(getQueryResult.rows[0][channelMap[shareChannel]])
if(!getQueryResult.rows[0][channelMap[shareChannel]]){
  const updateQuery ={
    text:`UPDATE users set score=score+50,${channelMap[shareChannel]}=true where email=$1`,
    values:[email]
  }
  await dbUtil.Query(updateQuery)
    return {message:'Score updated successfully'}
  }
    return{message:'already updated for this channel'}
  }
  )
}
