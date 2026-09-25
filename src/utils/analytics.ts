declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara eventos de conversão (Lead) para o Meta Pixel e Google Ads/GA4.
 * Executa de forma segura e silenciosa caso os scripts ainda não estejam configurados.
 */
export function trackBookingClick(location: string = "geral"): void {
  try {
    // Evento 'Lead' padrão no Meta Ads (Facebook/Instagram)
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "Agendamento de Horário",
        content_category: "Barbearia",
        button_location: location,
      });
    }

    // Evento 'generate_lead' padrão no Google Ads / GA4
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        event_category: "Conversão",
        event_label: location,
      });
    }
  } catch {
    // Silencioso em caso de bloqueadores ou falhas externas
  }
}
