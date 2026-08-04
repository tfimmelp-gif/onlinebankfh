import {objectStorage} from "../../../../server/runtime/object-storage";
import {NextResponse} from "next/server";
import {CUSTOMER_COOKIE,readCustomerSessionToken,verifyCustomerSessionToken} from "../../../../server/auth/customer-session";
import {getSimulationCustomerBank,saveSimulationKycDocument} from "../../../../server/d1/sim-bank";
import {validateMutationRequest} from "../../../../server/security/request";

function token(request:Request){return (request.headers.get("cookie")??"").split(";").map(value=>value.trim()).find(value=>value.startsWith(`${CUSTOMER_COOKIE}=`))?.slice(CUSTOMER_COOKIE.length+1);}
async function claims(request:Request){const value=token(request);const session=await readCustomerSessionToken(value);return session&&await verifyCustomerSessionToken(value)?session:null;}

export async function GET(request:Request){const session=await claims(request);if(!session)return NextResponse.json({error:"CUSTOMER_AUTH_REQUIRED"},{status:401});const bank=await getSimulationCustomerBank(session.userId);return NextResponse.json({documents:bank.kycDocuments},{headers:{"cache-control":"no-store"}});}

export async function POST(request:Request){
  const guard=validateMutationRequest(request,12*1024*1024);if(guard)return NextResponse.json({error:guard.error},{status:guard.status});
  const session=await claims(request);if(!session)return NextResponse.json({error:"CUSTOMER_AUTH_REQUIRED"},{status:401});
  const form=await request.formData();const file=form.get("file");const documentType=String(form.get("documentType")??"Identity document");
  if(!(file instanceof File))return NextResponse.json({error:"KYC_FILE_REQUIRED"},{status:400});
  if(!["image/jpeg","image/png","application/pdf"].includes(file.type)||file.size<=0||file.size>10*1024*1024)return NextResponse.json({error:"KYC_FILE_INVALID"},{status:422});
  const id=crypto.randomUUID();const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const objectKey=`kyc/${session.userId}/${id}-${safeName}`;
  const files=await objectStorage().catch(()=>null);if(!files)return NextResponse.json({error:"PRIVATE_FILE_STORAGE_UNAVAILABLE"},{status:503});
  await files.put(objectKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type},customMetadata:{userId:session.userId,originalFilename:file.name}});
  try{return NextResponse.json(await saveSimulationKycDocument({userId:session.userId,documentType,originalFilename:file.name,mediaType:file.type,byteSize:file.size,objectKey}),{status:201});}
  catch(error){await files.delete(objectKey);return NextResponse.json({error:error instanceof Error?error.message:"KYC_UPLOAD_FAILED"},{status:422});}
}
