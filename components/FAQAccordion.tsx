'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems } from '@/lib/data/faq';

export function FAQAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full divide-y divide-border rounded-xl border bg-card px-4 sm:px-6"
    >
      {faqItems.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-b-0 first:pt-2"
        >
          <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
