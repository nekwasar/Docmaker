import { Public_Sans, Archivo } from "next/font/google";

// Admin theme fonts — matched to the "Green Simple Company Project Proposal" PDF:
// body = PublicSans (exact), headings = Archivo Demi (closest free match to CyGrotesk-Key Demi).
export const adminBody = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const adminHead = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
});
