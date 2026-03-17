import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook receiver for n8n signature callbacks.
 * When a client signs a contract via the external signature provider,
 * n8n will send a POST to this route with the lead_id and PDF URL.
 * 
 * Expected payload:
 * {
 *   "lead_id": "uuid",
 *   "proposal_id": "uuid",
 *   "pdf_url": "https://...",
 *   "status": "assinado"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, proposal_id, pdf_url, status } = body;

    if (!lead_id || !proposal_id) {
      return NextResponse.json(
        { error: 'lead_id e proposal_id são obrigatórios' },
        { status: 400 }
      );
    }

    // TODO: Ativar integração Supabase com createServiceClient()
    // quando as variáveis de ambiente estiverem configuradas.
    //
    // const supabase = createServiceClient();
    //
    // // Atualiza o status do lead para 'assinado'
    // await supabase
    //   .from('leads')
    //   .update({ status: 'assinado', updated_at: new Date().toISOString() })
    //   .eq('id', lead_id);
    //
    // // Atualiza a proposta com URL do PDF e status
    // await supabase
    //   .from('proposals')
    //   .update({
    //     status_contrato: 'assinado',
    //     url_pdf_contrato: pdf_url || '',
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', proposal_id);

    console.log('[Webhook n8n] Assinatura recebida:', { lead_id, proposal_id, status });

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso',
    });
  } catch (error) {
    console.error('[Webhook n8n] Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar webhook' },
      { status: 500 }
    );
  }
}

// Opcional: GET para verificação de saúde do endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Antigravity Webhook Receiver',
    version: '1.0.0',
  });
}
