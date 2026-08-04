import {NextResponse} from "next/server";
import {CUSTOMER_COOKIE,readCustomerSessionToken,verifyCustomerSessionToken} from "../../../../server/auth/customer-session";
import {listSimulationVirtualCards,requestSimulationVirtualCard} from "../../../../server/d1/sim-bank";
import {validateMutationRequest} from "../../../../server/security/request";

function cookieValue(request:Request){const raw=request.headers.get("cookie")??"";return raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(`${CUSTOMER_COOKIE}=`))?.slice(CUSTOMER_COOKIE.length+1);}
async function claims(request:Request){const token=cookieValue(request);const value=await readCustomerSessionToken(token);return value&&await verifyCustomerSessionToken(token)?value:null;}
export async function GET(request:Request){const session=await claims(request);if(!session)return NextResponse.json({error:"CUSTOMER_AUTH_REQUIRED"},{status:401});return NextResponse.json({cards:await listSimulationVirtualCards(session.userId)},{headers:{"cache-control":"no-store"}});}
export async function POST(request:Request){const guard=validateMutationRequest(request);if(guard)return NextResponse.json({error:guard.error},{status:guard.status});const session=await claims(request);if(!session)return NextResponse.json({error:"CUSTOMER_AUTH_REQUIRED"},{status:401});const body=await request.json().catch(()=>({})) as {fundingAccountId?:string;displayName?:string;monthlyLimitMinor?:number};try{return NextResponse.json(await requestSimulationVirtualCard({userId:session.userId,fundingAccountId:body.fundingAccountId??"",displayName:body.displayName??"",monthlyLimitMinor:Number(body.monthlyLimitMinor??0)}),{status:201});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"CARD_REQUEST_FAILED"},{status:422});}}
