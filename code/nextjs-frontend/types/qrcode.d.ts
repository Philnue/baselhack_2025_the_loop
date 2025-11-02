declare module "qrcode" {
  export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  export interface QRCodeToDataURLOptions {
    readonly errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
    readonly margin?: number;
    readonly scale?: number;
    readonly width?: number;
  }

  export function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;
}
