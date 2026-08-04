export type RequestGuardFailure = { error:string; status:number };

export function observedRequestIp(request:Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

export function validateMutationRequest(request:Request,maxBytes=1_048_576):RequestGuardFailure|null {
  const contentLength=Number(request.headers.get("content-length")??0);
  if(Number.isFinite(contentLength)&&contentLength>maxBytes)return {error:"REQUEST_BODY_TOO_LARGE",status:413};
  const site=request.headers.get("sec-fetch-site");
  if(site&&!['same-origin','none'].includes(site))return {error:"CROSS_SITE_REQUEST_REJECTED",status:403};
  const origin=request.headers.get("origin");
  if(origin){
    try { if(new URL(origin).origin!==new URL(request.url).origin)return {error:"ORIGIN_REJECTED",status:403}; }
    catch { return {error:"ORIGIN_REJECTED",status:403}; }
  }
  return null;
}
