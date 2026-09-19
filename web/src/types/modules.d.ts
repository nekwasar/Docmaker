// Ambient declarations for untyped runtime deps.
declare module "mammoth" {
  export function extractRawText(input: { buffer: Buffer }): Promise<{ value: string }>;
  export function convertToHtml(input: { buffer: Buffer }): Promise<{ value: string }>;
}
