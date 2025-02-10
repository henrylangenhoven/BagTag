import { Component, Input } from '@angular/core';
import { QRCodeErrorCorrectionLevel, QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-code',
  imports: [QRCodeComponent],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss',
})
export class QrCodeComponent {
  @Input('dataString') dataString: string | undefined = 'Your data string';
  @Input('errorCorrectionLevel') errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'M';
  @Input('width') width = 256;
}
