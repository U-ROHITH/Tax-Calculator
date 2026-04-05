import type { Metadata } from 'next';
import TaxAssistant from '@/components/assistant/TaxAssistant';

export const metadata: Metadata = {
  title: 'AI Tax Assistant — India, US, UK | TaxCalc Global',
  description:
    'Ask any tax question and get expert answers citing actual tax sections. Covers Indian Income Tax Act, US IRC, UK HMRC. Powered by AI.',
};

export default function AssistantPage() {
  return <TaxAssistant />;
}
