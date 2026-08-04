export type RequestGuardFailure = { error:string; status:number };

export function observedRequestIp(request:Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

function firstForwardedValue(value:string|null) {
  return value?.split(",")[0]?.trim() || null;
}

export function publicRequestOrigin(request:Request) {
  const configuredHost=process.env.NORTHSTAR_HOST?.trim();
  if(configuredHost&&configuredHost!=="localhost"){
    try {
      return new URL(configuredHost.includes("://")?configuredHost:`https://${configuredHost}`).origin;
    } catch {
      return null;
    }
  }

  const forwardedHost=firstForwardedValue(request.headers.get("x-forwarded-host"));
  const host=forwardedHost??request.headers.get("host");
  const forwardedProtocol=firstForwardedValue(request.headers.get("x-forwarded-proto"));
  if(host&&forwardedProtocol&&["http","https"].includes(forwardedProtocol)){
    try { return new URL(`${forwardedProtocol}://${host}`).origin; }
    catch { return null; }
  }

  try { return new URL(request.url).origin; }
  catch { return null; }
}

export function validateMutationRequest(request:Request,maxBytes=1_048_576):RequestGuardFailure|null {
  const contentLength=Number(request.headers.get("content-length")??0);
  if(Number.isFinite(contentLength)&&contentLength>maxBytes)return {error:"REQUEST_BODY_TOO_LARGE",status:413};
  const site=request.headers.get("sec-fetch-site");
  if(site&&!['same-origin','none'].includes(site))return {error:"CROSS_SITE_REQUEST_REJECTED",status:403};
  const origin=request.headers.get("origin");
  if(origin){
    try {
      const expectedOrigin=publicRequestOrigin(request);
      if(!expectedOrigin||new URL(origin).origin!==expectedOrigin)return {error:"ORIGIN_REJECTED",status:403};
    }
    catch { return {error:"ORIGIN_REJECTED",status:403}; }
  }
  return null;
}
