import { createServerCaller } from "../../../../lib/trpc-server";
import { notFound } from "next/navigation";
import { ClientHeader } from "../../../../components/clients/client-header";
import { ClientTabs } from "../../../../components/clients/client-tabs";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params;
  const caller = await createServerCaller();

  const [client, timeline, forms, loyaltyBalance] = await Promise.all([
    caller.clients.getById({ clientId }).catch(() => null),
    caller.charting.getClientTimeline({ clientId }).catch(() => []),
    caller.forms.getClientForms({ clientId }).catch(() => ({ intake: [], consent: [] })),
    caller.clients.getLoyaltyBalance({ clientId }).catch(() => ({ balance: 0 })),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <ClientHeader client={client} loyaltyBalance={loyaltyBalance.balance} />
      <ClientTabs
        client={client}
        timeline={timeline}
        forms={forms}
      />
    </div>
  );
}
