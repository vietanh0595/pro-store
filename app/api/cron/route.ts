import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { CART_SESSION_EXP } from "@/lib/constants";

export async function GET() {
  await prisma.cart.deleteMany({
    where: {
      createdAt: {
        lt: new Date(Date.now() - CART_SESSION_EXP * 1000), // Less than (older than 1 min)
      },
    },
  });
  return NextResponse.json({ ok: true });
}
