import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteContent } from "@/constants/site-content";

export default function FAQ() {
  return (
    <section className="py-24 bg-white dark:bg-fluxion-dark">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-fluxion-blue dark:text-white mb-12 text-center">
          {siteContent.faq.title}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {siteContent.faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border-b border-slate-100 dark:border-white/10"
            >
              <AccordionTrigger className="font-bold text-left hover:text-fluxion-rose">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-500">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
