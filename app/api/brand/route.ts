import {NextResponse} from "next/server";
import {getActiveSimulationBrand} from "../../../server/d1/sim-bank";
export async function GET(){try{return NextResponse.json({brand:await getActiveSimulationBrand()},{headers:{"cache-control":"no-store"}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"BRAND_READ_FAILED"},{status:500});}}
