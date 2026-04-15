import { redirect } from 'next/navigation';

export default function VaultPage() {
  // The vault experience now lives at the home page (/)
  redirect('/');
}