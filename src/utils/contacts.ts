import { Client } from '../types/client';

function sanitize(value: string): string {
  return value.replace(/[\n\r]+/g, ' ').trim();
}

function buildVcf(clients: Client[]): string {
  return clients
    .map((client) => {
      const fullName = sanitize(client.name);
      const email = sanitize(client.email);
      const phone = sanitize(client.phone);
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${fullName}`,
        `N:${fullName};;;;`,
        `TEL;TYPE=CELL:${phone}`,
        `EMAIL;TYPE=INTERNET:${email}`,
        'END:VCARD',
      ].join('\n');
    })
    .join('\n');
}

export async function exportClientsToContacts(clients: Client[]): Promise<void> {
  const vcf = buildVcf(clients);
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const fileName = `timecare-clientes-${new Date().toISOString().slice(0, 10)}.vcf`;
  const file = new File([blob], fileName, { type: 'text/vcard' });

  if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: 'Contatos TimeCare',
      text: 'Clientes exportados pelo TimeCare',
      files: [file],
    });
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
